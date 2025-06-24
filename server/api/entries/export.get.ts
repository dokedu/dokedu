import { asc, desc, ilike, inArray, isNull, eq, and } from "drizzle-orm"
import { z } from "zod"
import { entries, entryTags, entryUsers, tags, users } from "~~/server/database/schema"
import { typstRenderTemplate } from "~~/server/utils/typst"
import { formatDate } from "date-fns"
import { de } from "date-fns/locale"

const querySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().min(0).max(100).default(25),
  offset: z.coerce.number().min(0).default(0),
  sortBy: z.enum(["date", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  tagId: z.string().optional(),
  studentId: z.string().optional(),
  teacherId: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const { secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { search, limit, sortBy, sortOrder, tagId, studentId, teacherId, offset } = await getValidatedQuery(event, querySchema.parse)

  const db = useDrizzle()
  const orderDirection = sortOrder === "asc" ? asc(entries[sortBy]) : desc(entries[sortBy])

  const q1 = db
    .select({
      id: entries.id,
      date: entries.date,
      body: entries.body,
      userId: entries.userId,
      createdAt: entries.createdAt,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName
      }
    })
    .from(entries)
    .leftJoin(users, eq(entries.userId, users.id))
    .orderBy(orderDirection)
    .offset(offset)
    .limit(limit + 1)
    .$dynamic()

  if (studentId) {
    q1.rightJoin(entryUsers, and(eq(entries.id, entryUsers.entryId), eq(entryUsers.userId, studentId), isNull(entryUsers.deletedAt)))
  }
  if (tagId) {
    q1.rightJoin(entryTags, and(eq(entries.id, entryTags.entryId), eq(entryTags.tagId, tagId), isNull(entryTags.deletedAt)))
  }

  const whereStatements = [eq(entries.organisationId, secure.organisationId), isNull(entries.deletedAt)]

  if (search) {
    whereStatements.push(ilike(entries.body, `%${search}%`))
  }

  // compare by entries.userId === teacherId
  if (teacherId) {
    whereStatements.push(eq(entries.userId, teacherId))
  }

  const result1 = await q1.where(and(...whereStatements))

  if (!result1.length) {
    return { meta: { total: 0 }, entries: [] }
  }

  const entryIds = result1.map((entry) => entry.id)

  // Fetch entry tags and tag details in a single query
  const result2 = await db
    .select({
      entryId: entryTags.entryId,
      tagId: entryTags.tagId,
      tagName: tags.name,
      tagColor: tags.color
    })
    .from(entryTags)
    .innerJoin(tags, eq(entryTags.tagId, tags.id))
    .where(
      and(
        eq(entryTags.organisationId, secure.organisationId),
        isNull(entryTags.deletedAt),
        inArray(entryTags.entryId, entryIds),
        eq(entryTags.organisationId, secure.organisationId)
      )
    )

  // Fetch entry users in a single query
  const result3 = await db
    .select({
      entryId: entryUsers.entryId,
      userId: entryUsers.userId,
      firstName: users.firstName,
      lastName: users.lastName
    })
    .from(entryUsers)
    .innerJoin(users, eq(entryUsers.userId, users.id))
    .where(and(isNull(entryUsers.deletedAt), inArray(entryUsers.entryId, entryIds), eq(entryUsers.organisationId, secure.organisationId)))

  // Construct final response
  const output = result1.slice(0, limit).map((entry) => ({
    ...entry,
    tags: result2.filter((tag) => tag.entryId === entry.id).map(({ tagId, tagName, tagColor }) => ({ id: tagId, name: tagName, color: tagColor })),
    users: result3.filter((entryUser) => entryUser.entryId === entry.id).map(({ userId, firstName, lastName }) => ({ id: userId, firstName, lastName }))
  }))

  // Create the PDF with the entries
  const pdfBuffer = await renderEntriesToPdf(output)

  // Return PDF response
  setHeader(event, "Content-Type", "application/pdf")
  setHeader(event, "Content-Disposition", `attachment; filename="entries-export-${new Date().toISOString().split("T")[0]}.pdf"`)

  return new Response(pdfBuffer)
})

async function renderEntriesToPdf(entries: any[]) {
  // Prepare data for the template
  const data = {
    entries: entries.map((entry) => ({
      date: formatDate(new Date(entry.date), "dd. MMMM yyyy", { locale: de }),
      body: entry.body || "",
      createdAt: formatDate(new Date(entry.createdAt), "dd. MMMM yyyy HH:mm", { locale: de }) + " Uhr",
      author: entry.user ? `${entry.user.firstName} ${entry.user.lastName}` : "Unbekannt",
      tags: entry.tags || [],
      students: entry.users || []
    }))
  }

  // Render the template to PDF
  return await typstRenderTemplate(ENTRIES_TEMPLATE, data)
}

const ENTRIES_TEMPLATE = `#let data = json("data.json")

#set text(font: "Inter", lang: "de")
// #set par(spacing: 0.75em)
#show heading: set block(below: 1.5em)
#set page(
  paper: "a4",
  margin: (top: 2cm, bottom: 2cm, x: 2cm),
  numbering: "1"
)

#for entry in data.entries [
  == #entry.date

  #entry.body

  #if entry.students.len() > 0 [
    *Schüler:* #entry.students.map(student => student.firstName + " " + student.lastName).join(", ")
  ]

  #if entry.tags.len() > 0 [
    *Tags:* #entry.tags.map(tag => tag.name).join(", ")
  ]

  _Erstellt am #entry.createdAt von #entry.author _

  #v(2em)
]`

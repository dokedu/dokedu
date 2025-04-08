import { asc, desc, ilike, inArray, isNull, eq, and } from "drizzle-orm"
import { z } from "zod"
import { entries, entryTags, entryUsers, tags, users } from "~~/server/database/schema"

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

  return {
    meta: {
      hasNextPage: result1.length > limit
    },
    entries: output
  }
})

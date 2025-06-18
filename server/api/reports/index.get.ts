import { desc, asc, getTableColumns, isNull, like, ilike } from "drizzle-orm"
import { reports, users } from "../../database/schema"
import { z } from "zod"

const querySchema = z.object({
  sortBy: z.enum(["firstName", "lastName", "studentGrade"]).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { sortBy, sort, search } = await getValidatedQuery(event, querySchema.parse)

  const existing = await useDrizzle().select().from(reports).where(eq(reports.organisationId, secure.organisationId))

  const students = await useDrizzle()
    .select()
    .from(users)
    .where(and(eq(users.role, "student"), isNull(users.deletedAt), eq(users.organisationId, secure.organisationId)))

  // Check if for each student there is a existing report, if not, create it
  for (const student of students) {
    const existingReport = existing.find((report) => report.studentId === student.id)
    if (!existingReport) {
      await useDrizzle().insert(reports).values({
        studentId: student.id,
        organisationId: secure.organisationId
      })
    }
  }

  // Check if there are duplicates, if so, delete the duplicate
  const duplicates = existing.filter((report, index, self) => self.findIndex((t) => t.studentId === report.studentId) !== index)
  for (const duplicate of duplicates) {
    await useDrizzle().delete(reports).where(eq(reports.id, duplicate.id))
  }

  const query = useDrizzle().query.reports.findMany({
    with: {
      student: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          studentGrade: true
        }
      }
    },
    where: and(eq(reports.organisationId, secure.organisationId))
  })

  // Apply sorting
  let result = await query

  // Sort the results based on student fields
  if (sortBy) {
    result.sort((a, b) => {
      let compareValue = 0

      switch (sortBy) {
        case "firstName":
          compareValue = (a.student.firstName || "").localeCompare(b.student.firstName || "")
          if (compareValue === 0) {
            compareValue = (a.student.lastName || "").localeCompare(b.student.lastName || "")
          }
          break
        case "lastName":
          compareValue = (a.student.lastName || "").localeCompare(b.student.lastName || "")
          break
        case "studentGrade":
          const aGrade = parseInt(a.student.studentGrade || "0", 10)
          const bGrade = parseInt(b.student.studentGrade || "0", 10)
          compareValue = aGrade - bGrade
          if (compareValue === 0) {
            compareValue = (a.student.firstName || "").localeCompare(b.student.firstName || "")
            if (compareValue === 0) {
              compareValue = (a.student.lastName || "").localeCompare(b.student.lastName || "")
            }
          }
          break
      }

      return sort === "desc" ? -compareValue : compareValue
    })
  } else {
    // Default sort by firstName, lastName
    result.sort((a, b) => {
      const firstNameCompare = (a.student.firstName || "").localeCompare(b.student.firstName || "")
      if (firstNameCompare !== 0) return firstNameCompare
      return (a.student.lastName || "").localeCompare(b.student.lastName || "")
    })
  }

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    result = result.filter(
      (report) =>
        report.student.firstName?.toLowerCase().includes(searchLower) || false || report.student.lastName?.toLowerCase().includes(searchLower) || false
    )
  }

  return result
})

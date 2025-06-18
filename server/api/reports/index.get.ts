import { desc, getTableColumns, isNull } from "drizzle-orm"
import { reports, users } from "../../database/schema"
import { z } from "zod"

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

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

  const result = await useDrizzle().query.reports.findMany({
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

  return result
})

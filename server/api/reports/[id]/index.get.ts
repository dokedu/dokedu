import { desc, getTableColumns, isNull } from "drizzle-orm"
import { reports, users } from "~~/server/database/schema"
import { z } from "zod"

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id } = await getValidatedRouterParams(event, paramsSchema.parse)

  const result = await useDrizzle().query.reports.findFirst({
    with: {
      student: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          studentGrade: true,
          studentBirthday: true,
          studentBirthplace: true
        }
      }
    },
    where: and(eq(reports.organisationId, secure.organisationId), eq(reports.id, id))
  })

  return result
})

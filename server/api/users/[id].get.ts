import { users } from "../../database/schema"
import { z } from "zod"

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id } = await getValidatedRouterParams(event, paramsSchema.parse)

  const result = await useDrizzle().query.users.findFirst({
    columns: {
      id: true,
      role: true,
      email: true,
      firstName: true,
      lastName: true,
      studentGrade: true,
      studentBirthday: true,
      studentBirthplace: true
    },
    where: and(eq(users.id, id), eq(users.organisationId, secure.organisationId))
  })

  return {
    ...result,
    studentBirthday: result?.studentBirthday?.toISOString().split("T")[0] ?? null
  }
})

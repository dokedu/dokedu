import { users } from "../../database/schema"
import { z } from "zod"
import { eq, and } from "drizzle-orm"

const userUpdateSchema = z.object({
  firstName: z.string().min(1, "First name must be at least 1 character long"),
  lastName: z.string().min(1, "Last name must be at least 1 character long"),
  studentBirthday: z.coerce.date().nullable().optional(),
  studentGrade: z.coerce.number().min(1).max(13).nullable().optional(),
  studentBirthplace: z.string().nullable().optional()
  // updatedAt: z.coerce.date()
})

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const { secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id } = await getValidatedRouterParams(event, paramsSchema.parse)
  const body = await readValidatedBody(event, userUpdateSchema.parse)

  try {
    const result = await useDrizzle()
      .update(users)
      .set({
        firstName: body.firstName,
        lastName: body.lastName,
        studentBirthday: body.studentBirthday,
        studentGrade: body.studentGrade ? `${body.studentGrade}` : null,
        studentBirthplace: body.studentBirthplace,
        updatedAt: new Date()
      })
      .where(and(eq(users.id, id), eq(users.organisationId, secure.organisationId)))
      .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        studentBirthday: users.studentBirthday,
        studentGrade: users.studentGrade,
        studentBirthplace: users.studentBirthplace
      })

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "User not found or not allowed"
      })
    }

    return result[0] // Return the updated user
  } catch (error) {
    console.error(error)
    throw createError({ statusCode: 400, message: "Invalid request" })
  }
})

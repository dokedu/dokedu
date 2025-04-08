import { nanoid } from "nanoid"
import { users } from "../../database/schema"
import { z } from "zod"
import { forgotPasswordProcess } from "../forgot-password.post"

const userSchema = z.object({
  id: z.string().nullable().optional().default(nanoid),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().nullable().optional(),
  role: z.enum(["owner", "admin", "teacher", "student"]),
  studentBirthday: z.coerce.date().nullable().optional(),
  studentGrade: z.coerce.number().min(1).max(13).nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional()
})

export default defineEventHandler(async (event) => {
  const { secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  try {
    const user = await readValidatedBody(event, userSchema.parse)

    if (user.role === "admin" || user.role === "teacher") {
      if (!user.email) throw createError({ statusCode: 400, message: "Invalid request body" })

      await useDrizzle().insert(users).values({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organisationId: secure.organisationId
      })

      // TODO: Send password reset email to user
      event.waitUntil(forgotPasswordProcess(user.email))

      return {}
    }

    const result = await useDrizzle()
      .insert(users)
      .values({ ...user, organisationId: secure.organisationId, role: "student" })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          firstName: user.firstName,
          lastName: user.lastName,
          role: "student",
          studentBirthday: user.studentBirthday,
          studentGrade: user.studentGrade ? `${user.studentGrade}` : null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt
        }
      })

    return result
  } catch (error) {
    console.error(error)
    throw createError({ statusCode: 400, message: "Invalid request body" })
  }
})

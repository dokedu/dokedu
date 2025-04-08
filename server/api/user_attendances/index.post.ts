import { userAttendances } from "../../database/schema"
import { z } from "zod"

const userAttendanceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.coerce.date(),
  state: z.enum(["present", "absent", "late", "sick"]),
  createdBy: z.string(),
  comment: z.string().nullable(),
  minutesDelayed: z.number().nullable(),
  organisationId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  try {
    const userAttendance = await readValidatedBody(event, userAttendanceSchema.parse)

    console.log(`[UPDATE] [userAttendance] ${userAttendance.id}`)

    const result = await useDrizzle()
      .insert(userAttendances)
      .values({
        ...userAttendance,
        organisationId: secure.organisationId
      })
      .onConflictDoUpdate({
        target: userAttendances.id,
        set: {
          id: userAttendance.id,
          createdBy: userAttendance.createdBy,
          date: userAttendance.date,
          state: userAttendance.state,
          userId: userAttendance.userId,
          comment: userAttendance.comment,
          minutesDelayed: userAttendance.minutesDelayed,
          organisationId: secure.organisationId,
          createdAt: userAttendance.createdAt,
          updatedAt: userAttendance.updatedAt,
          deletedAt: userAttendance.deletedAt
        }
      })

    return result
  } catch (error) {
    console.log(error)
    throw createError({ statusCode: 500, message: "Internal Server Error" })
  }
})

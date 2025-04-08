import { userAttendances } from "../../database/schema"
import { z } from "zod"

const userAttendanceSchema = z.object({
  userId: z.string(),
  date: z.coerce.date(),
  minutesDelayed: z.number().optional(),
  comment: z.string().optional(),
  state: z.enum(["present", "absent", "late", "sick"])
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const userAttendance = await readValidatedBody(event, userAttendanceSchema.parse)

  const result = await useDrizzle()
    .insert(userAttendances)
    .values({
      date: userAttendance.date,
      state: userAttendance.state,
      userId: userAttendance.userId,
      minutesDelayed: userAttendance.minutesDelayed,
      comment: userAttendance.comment,
      createdBy: user.id,
      organisationId: secure.organisationId
    })
    .onConflictDoUpdate({
      target: [userAttendances.userId, userAttendances.date, userAttendances.organisationId],
      set: {
        date: userAttendance.date,
        state: userAttendance.state,
        userId: userAttendance.userId,
        minutesDelayed: userAttendance.minutesDelayed,
        comment: userAttendance.comment,
        createdBy: user.id
      }
    })

  return {}
})

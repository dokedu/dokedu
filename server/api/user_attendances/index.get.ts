import { gt, isNull } from "drizzle-orm"
import { userAttendances, users } from "../../database/schema"
import { z } from "zod"

const querySchema = z.object({
  date: z.coerce.date()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { date } = await getValidatedQuery(event, querySchema.parse)

  const result = await useDrizzle().query.users.findMany({
    columns: {
      id: true,
      firstName: true,
      lastName: true
    },
    with: {
      userAttendances: {
        where: and(
          //
          eq(userAttendances.organisationId, secure.organisationId),
          eq(userAttendances.date, date)
        ),
        limit: 1
      }
    },
    where: and(
      //
      eq(tables.users.organisationId, secure.organisationId),
      eq(tables.users.role, "student"),
      isNull(tables.users.deletedAt)
    ),
    orderBy: [users.firstName, users.lastName]
  })

  return result
})

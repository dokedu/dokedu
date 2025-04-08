import { count } from "drizzle-orm"
import { z } from "zod"
import { entryUsers, userCompetences, users } from "~~/server/database/schema"

const routeParams = z.object({
  id: z.string(),
  userId: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id, userId } = await getValidatedRouterParams(event, routeParams.parse)

  // soft delete the entry user
  await useDrizzle()
    .update(entryUsers)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(entryUsers.organisationId, secure.organisationId),
        eq(entryUsers.entryId, id),
        eq(entryUsers.userId, userId)
        //
      )
    )

  // soft delete the user competence
  await useDrizzle()
    .update(userCompetences)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(userCompetences.organisationId, secure.organisationId),
        eq(userCompetences.entryId, id),
        eq(userCompetences.userId, userId)
        //
      )
    )

  return {}
})

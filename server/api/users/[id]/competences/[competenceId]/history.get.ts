import { eq, and, desc, isNull } from "drizzle-orm"
import { z } from "zod"
import { userCompetences, entries } from "~~/server/database/schema"

const routeParams = z.object({
  id: z.string(),
  competenceId: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id: userId, competenceId } = await getValidatedRouterParams(event, routeParams.parse)

  // Get all competence levels for this user and competence
  const history = await useDrizzle()
    .select({
      id: userCompetences.id,
      level: userCompetences.level,
      createdAt: userCompetences.createdAt,
      entryId: userCompetences.entryId,
      entry: {
        id: entries.id,
        date: entries.date,
        body: entries.body
      }
    })
    .from(userCompetences)
    .leftJoin(entries, eq(userCompetences.entryId, entries.id))
    .where(
      and(
        eq(userCompetences.userId, userId),
        eq(userCompetences.competenceId, competenceId),
        eq(userCompetences.organisationId, secure.organisationId),
        isNull(userCompetences.deletedAt)
      )
    )
    .orderBy(desc(userCompetences.createdAt))
    .limit(20)

  return history
})

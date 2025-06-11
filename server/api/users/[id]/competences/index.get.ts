import { isNull, eq, and, desc, asc } from "drizzle-orm"
import { z } from "zod"
import { competences, userCompetences, users } from "~~/server/database/schema"

const routeParams = z.object({
  id: z.string()
})

const querySchema = z.object({
  competenceId: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id: userId } = await getValidatedRouterParams(event, routeParams.parse)
  const { competenceId } = await getValidatedQuery(event, querySchema.parse)

  // Verify user exists and belongs to the organisation
  const targetUser = await useDrizzle()
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.id, userId), eq(users.organisationId, secure.organisationId)))
    .limit(1)

  if (targetUser.length === 0) {
    throw createError({ statusCode: 404, message: "User not found" })
  }

  // Get all competences for the organisation
  const allCompetences = await useDrizzle()
    .select()
    .from(competences)
    .where(
      and(
        competenceId ? eq(competences.competenceId, competenceId) : isNull(competences.competenceId),
        isNull(competences.deletedAt),
        eq(competences.organisationId, secure.organisationId)
      )
    )
    .orderBy(desc(competences.competenceType), asc(competences.name))
    .limit(2500)

  // Get all user competences for this user
  const userCompetencesList = await useDrizzle()
    .select({
      competenceId: userCompetences.competenceId,
      level: userCompetences.level,
      createdAt: userCompetences.createdAt
    })
    .from(userCompetences)
    .where(and(eq(userCompetences.userId, userId), isNull(userCompetences.deletedAt), eq(userCompetences.organisationId, secure.organisationId)))
    .orderBy(desc(userCompetences.createdAt))

  // Create a map of competenceId to latest level
  const competenceLevels = new Map<string, number>()
  const processedCompetences = new Set<string>()

  // Get only the latest level for each competence
  userCompetencesList.forEach((uc) => {
    if (!processedCompetences.has(uc.competenceId)) {
      competenceLevels.set(uc.competenceId, uc.level)
      processedCompetences.add(uc.competenceId)
    }
  })

  // Combine competences with user levels
  const result = allCompetences.map((competence) => ({
    ...competence,
    userLevel: competenceLevels.get(competence.id) ?? null
  }))

  return result.slice(0, 100)
})

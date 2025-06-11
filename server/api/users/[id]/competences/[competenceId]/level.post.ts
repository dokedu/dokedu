import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { userCompetences, competences, users } from "~~/server/database/schema"

const routeParams = z.object({
  id: z.string(),
  competenceId: z.string()
})

const bodySchema = z.object({
  level: z.number().min(0).max(3)
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id: userId, competenceId } = await getValidatedRouterParams(event, routeParams.parse)
  const { level } = await readValidatedBody(event, bodySchema.parse)

  // Verify user exists and belongs to the organisation
  const targetUser = await useDrizzle()
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.id, userId), eq(users.organisationId, secure.organisationId)))
    .limit(1)

  if (targetUser.length === 0) {
    throw createError({ statusCode: 404, message: "User not found" })
  }

  // Verify competence exists and belongs to the organisation
  const competence = await useDrizzle()
    .select({ id: competences.id })
    .from(competences)
    .where(and(eq(competences.id, competenceId), eq(competences.organisationId, secure.organisationId)))
    .limit(1)

  if (competence.length === 0) {
    throw createError({ statusCode: 404, message: "Competence not found" })
  }

  // Create a new user competence entry (manual override, no entry association)
  const result = await useDrizzle()
    .insert(userCompetences)
    .values({
      userId: userId,
      competenceId: competenceId,
      level: level,
      organisationId: secure.organisationId,
      createdBy: user.id,
      entryId: null // Manual override, not associated with an entry
    })
    .returning()

  return result[0]
})

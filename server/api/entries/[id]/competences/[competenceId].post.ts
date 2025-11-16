import { competences, entryUsers, userCompetences } from "~~/server/database/schema"
import { z } from "zod"

const routeParams = z.object({
  id: z.string(),
  competenceId: z.string()
})

const bodySchema = z.object({
  level: z.coerce.number().min(0).max(3).default(1).optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id, competenceId } = await getValidatedRouterParams(event, routeParams.parse)

  // check if there is a body
  let level = 1

  const { data, error } = await readValidatedBody(event, bodySchema.safeParse)
  if (data) {
    level = data.level ?? 1
  }

  // check if the competence is part of the organisation
  const competenceExists = await useDrizzle()
    .select({ id: competences.id })
    .from(competences)
    .where(and(eq(competences.id, competenceId), eq(competences.organisationId, secure.organisationId)))
  if (competenceExists.length === 0) throw createError({ statusCode: 404, message: "Competence not found" })

  // get entry users
  const result = await useDrizzle()
    .select({ userId: entryUsers.userId, deletedAt: entryUsers.deletedAt })
    .from(entryUsers)
    .where(
      and(
        //
        eq(entryUsers.entryId, id),
        eq(entryUsers.organisationId, secure.organisationId)
        // isNull(entryUsers.deletedAt)
      )
    )

  if (result.length === 0) return {}

  // create a user competence for the user for each competence
  const values = result.map((c) => ({
    userId: c.userId,
    competenceId: competenceId,
    entryId: id,
    level: level,
    organisationId: secure.organisationId,
    deletedAt: c.deletedAt
  }))

  await useDrizzle()
    .insert(userCompetences)
    .values(values)
    .onConflictDoUpdate({
      target: [userCompetences.userId, userCompetences.competenceId, userCompetences.entryId],
      set: {
        level: level,
        deletedAt: null
      }
    })

  return {}
})

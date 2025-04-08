import { isNull } from "drizzle-orm"
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

  // check if the user is part of the organisation
  const userExists = await useDrizzle()
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.id, userId), eq(users.organisationId, secure.organisationId)))
  if (userExists.length === 0) throw createError({ statusCode: 404, message: "User not found" })

  // create a entry user
  await useDrizzle()
    .insert(entryUsers)
    .values({
      entryId: id,
      userId: userId,
      organisationId: secure.organisationId
    })
    .onConflictDoUpdate({
      target: [entryUsers.userId, entryUsers.entryId],
      set: {
        entryId: id,
        userId: userId,
        deletedAt: null
      }
    })

  // go through the existing user competences for that entry and ensure the user has the same levels
  const result = await useDrizzle()
    .selectDistinct({ competenceId: userCompetences.competenceId, level: userCompetences.level })
    .from(userCompetences)
    .where(and(eq(userCompetences.entryId, id), eq(userCompetences.organisationId, secure.organisationId), isNull(userCompetences.deletedAt)))

  if (result.length > 0) {
    // create a user competence for the user for each competence
    const values = result.map((c) => ({
      userId: userId,
      entryId: id,
      competenceId: c.competenceId,
      level: c.level,
      organisationId: secure.organisationId
    }))

    await useDrizzle()
      .insert(userCompetences)
      .values(values)
      .onConflictDoUpdate({
        target: [userCompetences.userId, userCompetences.competenceId, userCompetences.entryId],
        set: {
          level: sql`excluded.level`,
          deletedAt: sql`excluded.deleted_at`
        }
      })
  }

  return {}
})

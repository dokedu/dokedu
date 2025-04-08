import { z } from "zod"
import { userCompetences } from "~~/server/database/schema"

const routeParams = z.object({
  id: z.string(),
  competenceId: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id, competenceId } = await getValidatedRouterParams(event, routeParams.parse)

  // soft delete the entry
  await useDrizzle()
    .update(userCompetences)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(userCompetences.organisationId, secure.organisationId),
        eq(userCompetences.competenceId, competenceId),
        eq(userCompetences.entryId, id)
        //
      )
    )
  return {}
})

import { isNull, eq, and } from "drizzle-orm"
import { z } from "zod"
import { competences } from "~~/server/database/schema"

const routeParams = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id } = await getValidatedRouterParams(event, routeParams.parse)

  const result = await useDrizzle()
    .select()
    .from(competences)
    .where(and(eq(competences.id, id), eq(competences.organisationId, secure.organisationId), isNull(competences.deletedAt)))
    .limit(1)

  if (result.length === 0) {
    throw createError({ statusCode: 404, message: "Competence not found" })
  }

  return result[0]
})

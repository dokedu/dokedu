import { entries } from "../../../database/schema"
import { z } from "zod"

const routeParams = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id } = await getValidatedRouterParams(event, routeParams.parse)

  // soft delete the entry
  const [result] = await useDrizzle()
    .update(entries)
    .set({
      deletedAt: new Date()
    })
    .where(and(eq(entries.organisationId, secure.organisationId), eq(entries.id, id)))
    .returning()

  return result
})

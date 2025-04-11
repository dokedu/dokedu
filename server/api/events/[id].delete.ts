import { events } from "../../database/schema"
import { z } from "zod"

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id } = await getValidatedRouterParams(event, paramsSchema.parse)

  return await useDrizzle()
    .update(events)
    .set({ deletedAt: new Date() })
    .where(and(eq(events.id, id), eq(events.organisationId, secure.organisationId)))
    .returning()
})

import { z } from "zod"
import { entryEvents } from "~~/server/database/schema"

const routeParams = z.object({
  id: z.string(),
  eventId: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id, eventId } = await getValidatedRouterParams(event, routeParams.parse)

  // soft delete the entry
  await useDrizzle()
    .update(entryEvents)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(entryEvents.organisationId, secure.organisationId),
        eq(entryEvents.entryId, id),
        eq(entryEvents.eventId, eventId)
        //
      )
    )
  return {}
})

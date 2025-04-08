import { z } from "zod"
import { entryEvents, events } from "~~/server/database/schema"

const routeParams = z.object({
  id: z.string(),
  eventId: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id, eventId } = await getValidatedRouterParams(event, routeParams.parse)

  // check if the event is part of the organisation
  const eventExists = await useDrizzle()
    .select({ id: events.id })
    .from(events)
    .where(and(eq(events.id, eventId), eq(events.organisationId, secure.organisationId)))
  if (eventExists.length === 0) throw createError({ statusCode: 404, message: "Event not found" })

  // create a entry event
  await useDrizzle()
    .insert(entryEvents)
    .values({
      entryId: id,
      eventId: eventId,
      organisationId: secure.organisationId
    })
    .onConflictDoUpdate({
      target: [entryEvents.eventId, entryEvents.entryId],
      set: {
        entryId: id,
        eventId: eventId,
        deletedAt: null
      }
    })

  return {}
})

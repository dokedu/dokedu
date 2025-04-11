import { events } from "~~/server/database/schema"
import { z } from "zod"

const eventSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  body: z.string().optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id, body, title, startsAt, endsAt } = await readValidatedBody(event, eventSchema.parse)

  let result

  if (title !== null) {
    result = await useDrizzle()
      .update(events)
      .set({ title, updatedAt: new Date() })
      .where(and(eq(events.id, id), eq(events.organisationId, secure.organisationId)))
      .returning()
  }

  if (body !== null) {
    result = await useDrizzle()
      .update(events)
      .set({ body, updatedAt: new Date() })
      .where(and(eq(events.id, id), eq(events.organisationId, secure.organisationId)))
      .returning()
  }

  if (startsAt) {
    result = await useDrizzle()
      .update(events)
      .set({ startsAt, updatedAt: new Date() })
      .where(and(eq(events.id, id), eq(events.organisationId, secure.organisationId)))
      .returning()
  }

  if (endsAt) {
    result = await useDrizzle()
      .update(events)
      .set({ endsAt, updatedAt: new Date() })
      .where(and(eq(events.id, id), eq(events.organisationId, secure.organisationId)))
      .returning()
  }

  return result
})

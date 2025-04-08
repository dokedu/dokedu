import { entries } from "../../../database/schema"
import { z } from "zod"

const entrySchema = z.object({
  id: z.string(),
  body: z.string(),
  date: z.coerce.date()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const entry = await readValidatedBody(event, entrySchema.parse)

  const [result] = await useDrizzle()
    .insert(entries)
    .values({
      id: entry.id,
      body: entry.body,
      date: entry.date,
      userId: user.id,
      organisationId: secure.organisationId
    })
    .onConflictDoUpdate({
      target: entries.id,
      set: {
        body: entry.body,
        date: entry.date,
        deletedAt: null
      }
    })
    .returning()

  return result
})

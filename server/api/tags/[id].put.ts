import { tags } from "../../database/schema"
import { z } from "zod"

const bodySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const body = await readValidatedBody(event, bodySchema.parse)

  await useDrizzle()
    .update(tags)
    .set({
      id: body.id,
      name: body.name,
      color: body.color,
      organisationId: secure.organisationId,
      updatedAt: new Date()
    })
    .where(and(eq(tags.id, body.id), eq(tags.organisationId, secure.organisationId)))

  return {}
})

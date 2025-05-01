import { tags } from "../../database/schema"
import { z } from "zod"

const bodySchema = z.object({
  name: z.string(),
  color: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const body = await readValidatedBody(event, bodySchema.parse)

  const result = await useDrizzle().insert(tags).values({
    name: body.name,
    color: body.color,
    organisationId: secure.organisationId
  })

  return result
})

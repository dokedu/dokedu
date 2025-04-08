import { users } from "../../database/schema"
import { z } from "zod"

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id } = await getValidatedRouterParams(event, paramsSchema.parse)

  await useDrizzle()
    .update(users)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(users.id, id), eq(users.organisationId, secure.organisationId)))

  return {}
})

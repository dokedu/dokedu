import { organisations } from "../../database/schema"

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const [result] = await useDrizzle()
    .select({
      id: organisations.id,
      name: organisations.name
    })
    .from(organisations)
    .where(eq(organisations.id, secure.organisationId))

  return result
})

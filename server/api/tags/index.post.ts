import { tags } from "../../database/schema"

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const body = await readBody(event)

  const result = await useDrizzle()
    .insert(tags)
    .values({
      id: body.id,
      name: body.name,
      color: body.color,
      organisationId: secure.organisationId,
      createdAt: new Date(Date.parse(body.createdAt)),
      updatedAt: new Date(Date.parse(body.updatedAt)),
      deletedAt: null
    })
    .onConflictDoUpdate({
      target: tags.id,
      set: {
        name: body.name,
        color: body.color,
        createdAt: new Date(Date.parse(body.createdAt)),
        updatedAt: new Date(Date.parse(body.updatedAt)),
        deletedAt: null
      }
    })

  // return result
  return result
})

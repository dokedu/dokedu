import { z } from "zod"
import { entryTags, tags } from "~~/server/database/schema"

const routeParams = z.object({
  id: z.string(),
  tagId: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id, tagId } = await getValidatedRouterParams(event, routeParams.parse)

  // check if the tag is part of the organisation
  const tagExists = await useDrizzle()
    .select({ id: tags.id })
    .from(tags)
    .where(and(eq(tags.id, tagId), eq(tags.organisationId, secure.organisationId)))
  if (tagExists.length === 0) throw createError({ statusCode: 404, message: "Tag not found" })

  // create a entry tag
  await useDrizzle()
    .insert(entryTags)
    .values({
      entryId: id,
      tagId: tagId,
      organisationId: secure.organisationId
    })
    .onConflictDoUpdate({
      target: [entryTags.tagId, entryTags.entryId],
      set: {
        entryId: id,
        tagId: tagId,
        deletedAt: null
      }
    })

  return {}
})

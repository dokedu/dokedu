import { z } from "zod"
import { entryTags } from "~~/server/database/schema"

const routeParams = z.object({
  id: z.string(),
  tagId: z.string()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id, tagId } = await getValidatedRouterParams(event, routeParams.parse)

  // soft delete the entry
  await useDrizzle()
    .update(entryTags)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(entryTags.organisationId, secure.organisationId),
        eq(entryTags.entryId, id),
        eq(entryTags.tagId, tagId)
        //
      )
    )
  return {}
})

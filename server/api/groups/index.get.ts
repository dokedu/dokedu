import { groups } from "../../database/schema"
import { isNull } from "drizzle-orm"
import { z } from "zod"

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const query = useDrizzle()
    .select()
    .from(groups)
    .where(and(isNull(groups.deletedAt), eq(groups.organisationId, secure.organisationId)))
    .orderBy(groups.name)

  return await query
})

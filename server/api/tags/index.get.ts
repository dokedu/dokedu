import { gt, isNull } from "drizzle-orm"
import * as tables from "../../database/schema"

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const result = await useDrizzle().query.tags.findMany({
    where: and(
      eq(tables.tags.organisationId, secure.organisationId),
      isNull(tables.tags.deletedAt)
      //
    ),
    orderBy: [tables.tags.name],
    limit: 1000
  })

  return result
})

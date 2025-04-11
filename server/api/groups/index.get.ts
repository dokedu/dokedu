import * as tables from "../../database/schema"
import { gt, isNull } from "drizzle-orm"
import { z } from "zod"

const table = "groups"

const querySchema = z.object({
  updatedAt: z.coerce.date().optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { updatedAt } = await getValidatedQuery(event, querySchema.parse)

  const query = useDrizzle()
    .select()
    .from(tables[table])
    .where(and(gt(tables[table].updatedAt, updatedAt), eq(tables[table].organisationId, secure.organisationId), isNull(tables[table].deletedAt)))

  return await query
})

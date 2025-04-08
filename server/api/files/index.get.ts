import { gt } from "drizzle-orm"
import * as tables from "../../database/schema"
import { z } from "zod"

const table = "files"

const querySchema = z.object({
  updatedAt: z.coerce.date().optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { updatedAt } = await getValidatedQuery(event, querySchema.parse)

  const query = useDrizzle().select().from(tables[table]).$dynamic()

  if (updatedAt) {
    query.where(and(gt(tables[table].updatedAt, updatedAt), eq(tables[table].organisationId, secure.organisationId)))
  } else {
    query.where(eq(tables[table].organisationId, secure.organisationId))
  }

  return await query
})

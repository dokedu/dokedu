import { desc, ilike, isNull } from "drizzle-orm"
import * as tables from "../../database/schema"
import { z } from "zod"

const table = "events"

const querySchema = z.object({
  search: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { search } = await getValidatedQuery(event, querySchema.parse)

  const query = useDrizzle()
    .select() //
    .from(tables[table])
    .orderBy(desc(tables[table].startsAt), desc(tables[table].endsAt))
    .limit(1000)
    .$dynamic()

  if (search) {
    query.where(
      and(
        eq(tables[table].organisationId, secure.organisationId),
        isNull(tables[table].deletedAt),
        ilike(tables[table].title, `%${search}%`)
        //
      )
    )
  } else {
    query.where(
      and(
        eq(tables[table].organisationId, secure.organisationId),
        isNull(tables[table].deletedAt)
        //
      )
    )
  }

  return await query
})

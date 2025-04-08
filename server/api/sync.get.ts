import * as tables from "../database/schema"
import { and, eq, gt } from "drizzle-orm"
import { z } from "zod"
import { getTableConfig } from "drizzle-orm/pg-core"

const querySchema = z.object({
  updatedAt: z.coerce.date()
})

export default defineEventHandler(async (event) => {
  const { secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { data, error } = await getValidatedQuery(event, querySchema.safeParse)

  // In case of error, we want to fall back to a date
  const updatedAt = error ? new Date() : data.updatedAt

  const tableList = [
    tables.files,
    tables.users,
    tables.entries,
    tables.entryUsers,
    tables.competences,
    tables.userCompetences,
    tables.entryFiles,
    tables.events,
    tables.entryEvents,
    tables.reportTemplates,
    tables.reports,
    tables.eventCompetences,
    tables.tags,
    tables.entryTags,
    tables.userAttendances,
    tables.groups,
    tables.groupUsers
  ]

  const results = await Promise.all(
    tableList.map(async (table) => {
      const result = await useDrizzle()
        .select({ id: table.id })
        .from(table)
        .where(and(gt(table.updatedAt, updatedAt), eq(table.organisationId, secure.organisationId)))
        .limit(1)
      return result.length > 0 ? getTableConfig(table).name : null
    })
  )

  return results.filter(Boolean)
})

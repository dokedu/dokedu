import { desc, getTableColumns } from "drizzle-orm"
import { reports, users } from "../../database/schema"
import { z } from "zod"

const querySchema = z.object({
  // updatedAt: z.coerce.date().optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const {} = await getValidatedQuery(event, querySchema.parse)

  // const query = useDrizzle()
  //   .select({
  //     ...getTableColumns(reports),
  //     createdBy: {
  //       id: true,
  //       firstName: true,
  //       lastName: true
  //     }
  //   })
  //   .from(reports)
  //   .leftJoin(users, eq(reports.createdBy, users.id))
  //   .where(and(eq(reports.organisationId, secure.organisationId)))
  //   .orderBy(desc(reports.createdAt))
  //   .limit(100)

  const query = useDrizzle().query.reports.findMany({
    with: {
      createdBy: {
        columns: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    },
    where: and(eq(reports.organisationId, secure.organisationId)),
    orderBy: [desc(reports.createdAt)]
  })

  return await query
})

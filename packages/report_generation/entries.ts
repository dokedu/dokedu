import { aliasedTable, desc, gte, inArray, isNull, lte } from "drizzle-orm"
import { reports, reportTemplates, entries, users, entryUsers } from "~~/server/database/schema"

export async function loader(reportId: string) {
  const report = await useDrizzle().query.reports.findFirst({ where: eq(reports.id, reportId) })
  if (!report) throw new Error("Report not found")

  const reportTemplate = await useDrizzle().query.reportTemplates.findFirst({ where: eq(reportTemplates.id, report.templateId!) })
  if (!reportTemplate) throw new Error("Report template not found")

  const entriesByUser: any = {}
  const entryUsersUser = aliasedTable(users, "user")

  const userId = report.options.users[0]

  const result = await useDrizzle()
    .select({
      id: entries.id,
      body: entries.body,
      date: entries.date,
      createdAt: entries.createdAt,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName
      },
      student: {
        id: entryUsersUser.id,
        firstName: entryUsersUser.firstName,
        lastName: entryUsersUser.lastName
      }
    })
    .from(entries)
    .leftJoin(users, and(eq(users.id, entries.userId), eq(users.organisationId, report.organisationId)))
    .rightJoin(entryUsers, and(eq(entryUsers.entryId, entries.id), isNull(entryUsers.deletedAt), eq(entryUsers.userId, userId)))
    .leftJoin(entryUsersUser, and(eq(entryUsersUser.id, entryUsers.userId), eq(entryUsersUser.organisationId, report.organisationId)))
    .where(
      and(
        eq(entries.organisationId, report.organisationId),
        isNull(entries.deletedAt),
        gte(entries.date, new Date(Date.parse(report.options.start))),
        lte(entries.date, new Date(Date.parse(report.options.end)))
      )
    )
    .orderBy(desc(entries.date))

  const formatter = Intl.DateTimeFormat("de", {
    year: "numeric",
    month: "long",
    day: "2-digit"
  })

  const formatterTwo = Intl.DateTimeFormat("de", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  })

  entriesByUser[userId] = result.map((c) => {
    return {
      ...c,
      date: formatter.format(c.date),
      createdAt: formatterTwo.format(c.createdAt)
    }
  })

  return {
    entries: entriesByUser[userId]
  }
}

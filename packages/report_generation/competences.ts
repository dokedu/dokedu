import { eq, and, isNull, gte, lte, desc, isNotNull } from "drizzle-orm"
import { competences, reports, userCompetences } from "../../server/database/schema"
import { useDrizzle } from "../../server/utils/drizzle"
import { colors } from "./utils/color.json"
import type { DCompetence } from "~/types/models"

export async function loader(reportId: string) {
  const report = await useDrizzle().query.reports.findFirst({ where: eq(reports.id, reportId) })
  if (!report) throw new Error("Report not found")

  const userId = report.options.users[0]
  if (!userId) throw new Error("User not found")

  const filterStart = new Date(Date.parse(report.options.start))
  const filterEnd = new Date(Date.parse(report.options.end))
  // make it end of day
  filterEnd.setHours(23, 59, 59, 999)

  const result = await useDrizzle()
    .select()
    .from(competences)
    .where(
      and(
        isNull(competences.deletedAt), //
        eq(competences.organisationId, report.organisationId)
        // isNull(competences.competenceId)
      )
    )
    .orderBy(competences.name)

  const subjects = result.filter((c) => c.competenceId === null)

  const userCompetenceList = await useDrizzle()
    .select()
    .from(userCompetences)
    .where(
      and(
        isNull(userCompetences.deletedAt),
        isNotNull(userCompetences.competenceId),
        eq(userCompetences.organisationId, report.organisationId),
        eq(userCompetences.userId, userId),
        gte(userCompetences.createdAt, filterStart),
        lte(userCompetences.createdAt, filterEnd)
      )
    )
    .orderBy(desc(userCompetences.createdAt))

  function children(competence: DCompetence) {
    const items = result.filter((c) => c.competenceId === competence.id)
    if (items.length === 0) return []

    let output: any[] = []
    for (const c of items) {
      output.push({
        ...c,
        color: colors["100"].gray,
        color200: colors["200"].gray,
        color900: colors["900"].gray,
        // random number between 0-3
        level: userCompetenceList.find((uc) => uc.competenceId === c.id && uc.userId === userId)?.level || 0
      })
      output = output.concat(children(c))
    }
    return output
  }

  const subjectCompetencesMap = new Map<string, DCompetence[]>()
  for (const subject of result) {
    subjectCompetencesMap.set(subject.id, children(subject))
  }

  return {
    competences: subjects.map((subject) => ({
      ...subject,
      color: colors["100"][subject.color] || colors["100"].gray,
      color200: colors["200"][subject.color] || colors["200"].gray,
      color900: colors["900"][subject.color] || colors["900"].gray,
      competences: subjectCompetencesMap.get(subject.id) || [],
      level: 0
    }))
  }
}

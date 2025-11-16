import { z } from "zod"
import { reports } from "~~/server/database/schema"

const paramsSchema = z.object({
  id: z.string()
})

const bodySchema = z.object({
  status: z.enum(["draft", "in_progress", "in_review", "completed"]).optional(),
  schoolYear: z.string().optional(),
  introduction: z.string().optional(),
  competences: z.array(z.string()).optional(),
  enableDateFilter: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  onlyLearnedCompetences: z.boolean().optional(),
  showCoverPage: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id } = await getValidatedRouterParams(event, paramsSchema.parse)
  const { status, schoolYear, introduction, competences, enableDateFilter, startDate, endDate, onlyLearnedCompetences, showCoverPage } =
    await readValidatedBody(event, bodySchema.parse)

  // Update the existing report with the new values
  await useDrizzle()
    .update(reports)
    .set({
      ...(status !== undefined && { status }),
      content: {
        schoolYear,
        introduction,
        competences,
        enableDateFilter,
        startDate,
        endDate,
        onlyLearnedCompetences,
        showCoverPage
      },
      updatedAt: new Date()
    })
    .where(and(eq(reports.id, id), eq(reports.organisationId, secure.organisationId)))

  return {}
})

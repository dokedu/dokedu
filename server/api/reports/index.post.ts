import { z } from "zod"
import { reports } from "../../database/schema"

const bodySchema = z.object({
  templateId: z.string(),
  options: z.object({
    start: z.string(),
    end: z.string(),
    users: z.array(z.string())
  })
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const body = await readValidatedBody(event, bodySchema.parse)

  console.log(body.options)

  const [result] = await useDrizzle()
    .insert(reports)
    .values({
      status: "pending",
      templateId: body.templateId,
      createdBy: user.id,
      options: body.options,
      organisationId: secure.organisationId
    })
    .returning()

  const { result: taskResult } = await runTask("report:generate", { payload: { id: result.id } })
  console.error(taskResult)

  return result
})

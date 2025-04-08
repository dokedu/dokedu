import { reports } from "../../../database/schema"
import { z } from "zod"

const querySchema = z.object({
  updatedAt: z.coerce.date().optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const id = getRouterParam(event, "id")
  if (!id) throw createError({ statusCode: 404, message: "Not found" })

  await useDrizzle()
    .update(reports)
    .set({ status: "error", updatedAt: new Date() })
    .where(and(eq(reports.organisationId, secure.organisationId), eq(reports.id, id)))

  return "ok"
})

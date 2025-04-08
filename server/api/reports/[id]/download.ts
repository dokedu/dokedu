import { gt } from "drizzle-orm"
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

  const results = await useDrizzle()
    .select()
    .from(reports)
    .where(and(eq(reports.organisationId, secure.organisationId), eq(reports.id, id)))

  const report = results[0]

  const arrayBuffer = await useStorage("files").getItemRaw(`reports:${report.id}`)

  console.info(`[DOWNLOAD] ${report.id}`)

  const fileName = `${report.createdAt.getUTCFullYear()}-${(report.createdAt.getUTCMonth() + 1).toString().padStart(2, "0")}-${report.createdAt.getUTCDate().toString().padStart(2, "0")}-${report.id}.pdf`

  // set the Content-Type header
  setHeader(event, "Content-Type", "application/pdf")
  // set auto download header
  setHeader(event, "Content-Disposition", `attachment; filename=${fileName}`)

  // return the file as a response
  return new Response(arrayBuffer)
})

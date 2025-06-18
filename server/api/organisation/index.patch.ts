import { organisations } from "../../database/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

const updateOrganisationSchema = z.object({
  name: z.string().min(1).max(255).optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  // Only allow admins and owners to update organisation
  if (user.role !== "admin" && user.role !== "owner") {
    throw createError({ statusCode: 403, message: "Forbidden" })
  }

  const body = await readValidatedBody(event, (body) => updateOrganisationSchema.parse(body))

  const [result] = await useDrizzle()
    .update(organisations)
    .set({
      name: body.name,
      updatedAt: new Date()
    })
    .where(eq(organisations.id, secure.organisationId))
    .returning({
      id: organisations.id,
      name: organisations.name,
      logo: organisations.logoFileId
    })

  return result
})

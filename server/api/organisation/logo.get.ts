import { organisations } from "~~/server/database/schema"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const [organisation] = await useDrizzle().select().from(organisations).where(eq(organisations.id, secure.organisationId))

  if (!organisation?.logoFileId) throw createError({ statusCode: 404, message: "Logo not found" })

  // get the file from storage
  const buffer = await useStorage("files").getItemRaw(organisation.logoFileId)
  if (!buffer) throw createError({ statusCode: 404, message: "Logo file not found in storage" })

  // Set appropriate headers for image
  // Since we don't store the MIME type, we'll use a generic image type
  // The browser will usually handle it correctly based on the actual content
  setHeader(event, "Content-Type", "image/*")

  return buffer
})

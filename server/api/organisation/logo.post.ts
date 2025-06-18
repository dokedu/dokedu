import { nanoid } from "nanoid"
import { organisations } from "~~/server/database/schema"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  // read the form data
  const formData = await readFormData(event)
  const file = formData.get("file") as File

  if (!file) throw createError({ statusCode: 400, message: "No file provided" })

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    throw createError({ statusCode: 400, message: "Invalid file type. Only images are allowed." })
  }

  // Validate file size (e.g., 5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw createError({ statusCode: 400, message: "File too large. Maximum size is 5MB." })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const id = nanoid()

  // save the file to storage
  await useStorage("files").setItemRaw(id, buffer)

  // update the database
  await useDrizzle().update(organisations).set({ logoFileId: id, updatedAt: new Date() }).where(eq(organisations.id, secure.organisationId))

  return { success: true }
})

import { sessions, users } from "../database/schema"
import * as bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { z } from "zod"

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse)

  // Find user
  const results = await useDrizzle().select().from(users).where(eq(users.email, email.toLowerCase())).limit(1)
  if (results.length !== 1) throw createError({ statusCode: 401, message: "Bad credentials" })
  const user = results[0]

  if (!user.password) throw createError({ statusCode: 401, message: "Bad credentials" })

  // Check if using old hashed password
  if (user.password.startsWith("$2a$")) {
    console.log("using old hashed password")
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw createError({ statusCode: 401, message: "Bad credentials" })

    // Update to new hashed password
    console.log("updating to new hashed password")
    const newHash = await Bun.password.hash(password)
    await useDrizzle().update(users).set({ password: newHash }).where(eq(users.id, user.id))
  } else {
    // Verify password
    const isMatch = await Bun.password.verify(password, user.password)
    if (!isMatch) throw createError({ statusCode: 401, message: "Bad credentials" })
  }

  // Create a user session
  const created = await useDrizzle()
    .insert(sessions)
    .values({
      token: nanoid(64),
      userId: user.id
    })
    .returning()

  const session = created[0]

  await setUserSession(event, {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email!,
      role: user.role,
      organisationId: user.organisationId
    },
    secure: {
      token: session.token,
      organisationId: user.organisationId
    }
  })

  return {}
})

import { z } from "zod"
import { organisations, users } from "../database/schema"

const bodySchema = z.object({
  organisationName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
  // return false
  const body = await readValidatedBody(event, bodySchema.parse)

  // check if the user already exists
  const existing = await useDrizzle().select().from(users).where(eq(users.email, body.email))
  if (existing.length > 0) {
    // do not throw an error just respond okay so the user can check their email
    return {}
  }

  // Create organisation
  const createdOrgs = await useDrizzle()
    .insert(organisations)
    .values({
      name: body.organisationName
    })
    .returning()

  const org = createdOrgs[0]

  const user = await useDrizzle()
    .insert(users)
    .values({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: await Bun.password.hash(body.password),
      role: "owner",
      organisationId: org.id
    })
    .returning()

  return {}
})

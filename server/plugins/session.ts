import { sessions } from "../database/schema"
import { eq, isNull } from "drizzle-orm"

// server/plugins/session.ts
export default defineNitroPlugin(() => {
  // Called when the session is fetched during SSR for the Vue composable (/api/_auth/session)
  // Or when we call useUserSession().fetch()
  sessionHooks.hook("fetch", async (session, event) => {
    if (!session.secure) throw createError({ statusCode: 401, message: "Invalid token" })

    const existing = await useDrizzle()
      .select()
      .from(sessions)
      .where(and(eq(sessions.token, session.secure.token), isNull(sessions.deletedAt)))
    if (!existing) throw createError({ statusCode: 401, message: "Invalid token" })

    // Check that the createdAt date is max 7 days ago
    const createdAt = new Date(existing[0].createdAt)
    const maxAge = new Date(createdAt.getTime() - 1000 * 60 * 60 * 24 * 7)
    if (createdAt < maxAge) throw createError({ statusCode: 401, message: "Invalid token" })
  })
  // Called when we call useUserSession().clear() or clearUserSession(event)
  sessionHooks.hook("clear", async (session, event) => {
    // Log that user logged out
    await useDrizzle().update(sessions).set({ deletedAt: new Date() }).where(eq(sessions.token, session.secure!.token))
  })
})

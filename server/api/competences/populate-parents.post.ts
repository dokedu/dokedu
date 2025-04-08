import { eq, isNull, and } from "drizzle-orm"
import * as tables from "../../database/schema"

export default defineEventHandler(async (event) => {
  const header = getHeader(event, "api-key")
  if (header !== "secret") {
    throw createError({ statusCode: 401, message: "Unauthorized" })
  }

  event.waitUntil(async () => {
    const db = useDrizzle()

    // Get all competences
    const allCompetences = await db.select().from(tables.competences).where(isNull(tables.competences.deletedAt))

    // Create a map for faster lookup
    const competencesMap = new Map(allCompetences.map((comp) => [comp.id, comp]))

    // Process each competence to build its parents array
    for (const [index, competence] of allCompetences.entries()) {
      console.log(`Processing ${index + 1} of ${allCompetences.length}`)

      const parents = []
      let currentCompetence = competence

      // Traverse up the tree to collect all parent IDs
      while (currentCompetence.competenceId) {
        const parentId = currentCompetence.competenceId
        parents.unshift(parentId) // Add to the beginning to maintain root-to-leaf order

        const nextCompetence = competencesMap.get(parentId)
        if (!nextCompetence) break // Safety check
        currentCompetence = nextCompetence
      }

      // Update the competence with its parents array
      await db.update(tables.competences).set({ parents }).where(eq(tables.competences.id, competence.id))
    }

    return null
  })

  return { success: true, message: "Parents populated for all competences" }
})

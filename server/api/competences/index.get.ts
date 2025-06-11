import { isNull, arrayContains } from "drizzle-orm"
import { competences } from "~~/server/database/schema"
import MiniSearch from "minisearch"
import { z } from "zod"

// const table = "competences"

const querySchema = z.object({
  everything: z.coerce.boolean().optional().default(false),
  search: z.string().optional(),
  competenceId: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { search, competenceId, everything } = await getValidatedQuery(event, querySchema.parse)

  // if (everything) {
  //   return useDrizzle()
  //     .select()
  //     .from(competences)
  //     .where(and(eq(competences.organisationId, secure.organisationId), isNull(competences.deletedAt)))
  // }

  let parent = null
  if (competenceId) {
    parent = await useDrizzle().query.competences.findFirst({
      where: and(eq(competences.id, competenceId), eq(competences.organisationId, secure.organisationId))
    })

    if (!parent) {
      return []
    }
  }

  const result = await useDrizzle()
    .select()
    .from(competences)
    .where(
      and(
        // parent && parent.parents ? arrayContains(competences.parents, [...parent.parents, parent.id].filter(Boolean)) : isNull(competences.competenceId),
        competenceId ? eq(competences.competenceId, competenceId) : isNull(competences.competenceId),
        // ...(search ? [sql`to_tsvector('german', ${competences.name}) @@ websearch_to_tsquery('german', ${search})`] : []),
        isNull(competences.deletedAt),
        eq(competences.organisationId, secure.organisationId)
      )
    )
    // .orderBy(desc(competences.competenceType), asc(competences.name))
    .limit(2500)

  if (search) {
    let miniSearch = new MiniSearch({
      fields: ["name"], // fields to index for full-text search
      storeFields: ["id", "name"], // fields to return with search results
      searchOptions: {
        fuzzy: 0.49
      }
    })

    // Index all documents
    miniSearch.addAll(result)

    // Search with default options
    let results = miniSearch.search(search)

    const items = result.filter((c) => results.find((el) => el.id === c.id))

    // .orderBy(desc(competences.competenceType), asc(competences.name))
    return items.slice(0, 100)
  } else {
    return result.slice(0, 100)
  }
})

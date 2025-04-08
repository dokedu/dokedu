import { asc, desc, ilike, isNull } from "drizzle-orm"
import { z } from "zod"
import { entries, entryEvents, entryTags, entryUsers, tags, userCompetences, users } from "../../../database/schema"

const routeParams = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const { secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { id } = await getValidatedRouterParams(event, routeParams.parse)

  const result = await useDrizzle().query.entries.findFirst({
    with: {
      // user: {
      //   columns: {
      //     id: true,
      //     firstName: true,
      //     lastName: true,
      //     role: true
      //   }
      // },
      entryTags: {
        columns: {},
        with: {
          tag: {
            columns: {
              id: true,
              name: true,
              color: true
            }
          }
        },
        where: isNull(entryTags.deletedAt)
      },
      entryUsers: {
        columns: {},
        with: {
          user: {
            columns: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          }
        },
        where: isNull(entryUsers.deletedAt)
      },
      userCompetences: {
        with: {
          competence: true
        },
        where: isNull(userCompetences.deletedAt),
        orderBy: userCompetences.createdAt
      },
      entryEvents: {
        with: {
          event: {}
        },
        where: isNull(entryEvents.deletedAt)
      }
    },
    where: and(
      //
      eq(entries.organisationId, secure.organisationId),
      isNull(entries.deletedAt),
      eq(entries.id, id)
    )
  })

  let output = {
    ...result
    // userCompetences: [],
    // competences: Array.from(new Map(result.userCompetences.map((uc) => [uc.competence.id, uc.competence])).values())
  }

  return output
})

import { desc, asc, isNull, ne, like, ilike } from "drizzle-orm"
import { users } from "../../database/schema"
import { z } from "zod"

const querySchema = z.object({
  role: z.enum(["student", "ne.student"]).optional(),
  sortBy: z.enum(["firstName", "lastName", "studentGrade", "studentBirthday"]).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const { role, sortBy, sort, search } = await getValidatedQuery(event, querySchema.parse)

  const query = useDrizzle()
    .select({
      id: users.id,
      role: users.role,
      firstName: users.firstName,
      lastName: users.lastName,
      studentGrade: users.studentGrade,
      studentBirthday: users.studentBirthday,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    })
    .from(users)
    .$dynamic()
    .limit(1000)

  switch (sortBy) {
    case "firstName":
      if (sort === "asc") {
        query.orderBy(users.firstName, users.lastName)
      } else {
        query.orderBy(desc(users.firstName), desc(users.lastName))
      }
      break
    case "lastName":
      if (sort === "asc") {
        query.orderBy(users.lastName)
      } else {
        query.orderBy(desc(users.lastName))
      }
      break
    case "studentGrade":
      if (sort === "asc") {
        query.orderBy(users.studentGrade, users.firstName, users.lastName)
      } else {
        query.orderBy(desc(users.studentGrade), desc(users.firstName), desc(users.lastName))
      }
      break
    case "studentBirthday":
      if (sort === "asc") {
        query.orderBy(users.studentBirthday, users.firstName, users.lastName)
      } else {
        query.orderBy(desc(users.studentBirthday), desc(users.firstName), desc(users.lastName))
      }
      break
    default:
      query.orderBy(asc(users.firstName), asc(users.lastName))
      break
  }

  const whereClauses = [
    eq(users.organisationId, secure.organisationId),
    isNull(users.deletedAt)
    //
  ]

  if (role) {
    whereClauses.push(role === "ne.student" ? ne(users.role, "student") : eq(users.role, role))
  }

  if (search) {
    whereClauses.push(or(ilike(users.firstName, `%${search}%`), ilike(users.lastName, `%${search}%`)))
  }

  query.where(and(...whereClauses))

  return await query
})

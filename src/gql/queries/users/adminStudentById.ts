import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type AdminStudentByIdQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type AdminStudentByIdQuery = { __typename?: "Query" } & {
  user: { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName" | "role"> & {
      student?: Types.Maybe<
        { __typename?: "UserStudent" } & Pick<
          Types.UserStudent,
          "id" | "grade" | "birthday" | "joinedAt" | "leftAt" | "emoji"
        >
      >
    }
}

export const AdminStudentByIdDocument = gql`
  query adminStudentById($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      role
      student {
        id
        grade
        birthday
        joinedAt
        leftAt
        emoji
      }
    }
  }
`

export function useAdminStudentByIdQuery(
  options: Omit<Urql.UseQueryArgs<never, AdminStudentByIdQueryVariables>, "query">
) {
  return Urql.useQuery<AdminStudentByIdQuery, AdminStudentByIdQueryVariables>({
    query: AdminStudentByIdDocument,
    ...options
  })
}

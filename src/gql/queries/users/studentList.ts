import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type StudentListQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars["String"]["input"]>
}>

export type StudentListQuery = { __typename?: "Query" } & {
  users: { __typename?: "UserConnection" } & {
    edges?: Types.Maybe<
      Array<
        Types.Maybe<
          { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName"> & {
              student?: Types.Maybe<{ __typename?: "UserStudent" } & Pick<Types.UserStudent, "id" | "grade" | "emoji">>
            }
        >
      >
    >
  }
}

export const StudentListDocument = gql`
  query studentList($search: String) {
    users(filter: { role: [student], orderBy: lastNameAsc }, search: $search, limit: 1000) {
      edges {
        id
        firstName
        lastName
        student {
          id
          grade
          emoji
        }
      }
    }
  }
`

export function useStudentListQuery(options: Omit<Urql.UseQueryArgs<never, StudentListQueryVariables>, "query">) {
  return Urql.useQuery<StudentListQuery, StudentListQueryVariables>({ query: StudentListDocument, ...options })
}

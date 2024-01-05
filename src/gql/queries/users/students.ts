import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type StudentsQueryVariables = Types.Exact<{ [key: string]: never }>

export type StudentsQuery = { __typename?: "Query" } & {
  users: { __typename?: "UserConnection" } & {
    edges?: Types.Maybe<
      Array<
        Types.Maybe<
          { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName"> & {
              student?: Types.Maybe<{ __typename?: "UserStudent" } & Pick<Types.UserStudent, "id">>
            }
        >
      >
    >
  }
}

export const StudentsDocument = gql`
  query students {
    users(filter: { role: [student] }, limit: 1000) {
      edges {
        id
        firstName
        lastName
        student {
          id
        }
      }
    }
  }
`

export function useStudentsQuery(options: Omit<Urql.UseQueryArgs<never, StudentsQueryVariables>, "query">) {
  return Urql.useQuery<StudentsQuery, StudentsQueryVariables>({ query: StudentsDocument, ...options })
}

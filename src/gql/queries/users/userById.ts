import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type UserByIdQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type UserByIdQuery = { __typename?: "Query" } & {
  user: { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName"> & {
      student?: Types.Maybe<
        { __typename?: "UserStudent" } & Pick<
          Types.UserStudent,
          "id" | "grade" | "joinedAt" | "leftAt" | "entriesCount" | "competencesCount" | "eventsCount" | "emoji"
        >
      >
    }
}

export const UserByIdDocument = gql`
  query userById($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      student {
        id
        grade
        joinedAt
        leftAt
        entriesCount
        competencesCount
        eventsCount
        emoji
      }
    }
  }
`

export function useUserByIdQuery(options: Omit<Urql.UseQueryArgs<never, UserByIdQueryVariables>, "query">) {
  return Urql.useQuery<UserByIdQuery, UserByIdQueryVariables>({ query: UserByIdDocument, ...options })
}

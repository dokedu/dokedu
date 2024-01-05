import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type UsersQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars["String"]["input"]>
}>

export type UsersQuery = { __typename?: "Query" } & {
  users: { __typename?: "UserConnection" } & {
    edges?: Types.Maybe<Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName">>>>
  }
}

export const UsersDocument = gql`
  query users($search: String) {
    users(filter: { role: [student], orderBy: lastNameAsc }, search: $search, limit: 1000) {
      edges {
        id
        firstName
        lastName
      }
    }
  }
`

export function useUsersQuery(options: Omit<Urql.UseQueryArgs<never, UsersQueryVariables>, "query">) {
  return Urql.useQuery<UsersQuery, UsersQueryVariables>({ query: UsersDocument, ...options })
}

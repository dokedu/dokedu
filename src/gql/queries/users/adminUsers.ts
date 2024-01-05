import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type AdminUsersQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars["String"]["input"]>
  order?: Types.InputMaybe<Types.UserOrderBy>
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>
  showDeleted?: Types.InputMaybe<Types.Scalars["Boolean"]["input"]>
}>

export type AdminUsersQuery = { __typename?: "Query" } & {
  users: { __typename?: "UserConnection" } & {
    pageInfo: { __typename?: "PageInfo" } & Pick<Types.PageInfo, "hasNextPage" | "hasPreviousPage">
    edges?: Types.Maybe<
      Array<Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName" | "email">>>
    >
  }
}

export const AdminUsersDocument = gql`
  query adminUsers($search: String, $order: UserOrderBy, $offset: Int, $showDeleted: Boolean) {
    users(
      filter: { role: [owner, admin, teacher], orderBy: $order, showDeleted: $showDeleted }
      search: $search
      offset: $offset
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        id
        firstName
        lastName
        email
      }
    }
  }
`

export function useAdminUsersQuery(options: Omit<Urql.UseQueryArgs<never, AdminUsersQueryVariables>, "query">) {
  return Urql.useQuery<AdminUsersQuery, AdminUsersQueryVariables>({ query: AdminUsersDocument, ...options })
}

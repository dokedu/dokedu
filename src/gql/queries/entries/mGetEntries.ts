import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type MGetEntriesQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>
  order?: Types.InputMaybe<Types.EntrySortBy>
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>
}>

export type MGetEntriesQuery = { __typename?: "Query" } & {
  entries: { __typename?: "EntryConnection" } & {
    pageInfo: { __typename?: "PageInfo" } & Pick<Types.PageInfo, "hasNextPage" | "hasPreviousPage">
    edges: Array<
      { __typename?: "Entry" } & Pick<Types.Entry, "id" | "date" | "body" | "createdAt"> & {
          user: { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName">
        }
    >
  }
}

export const MGetEntriesDocument = gql`
  query mGetEntries($limit: Int, $order: EntrySortBy, $offset: Int) {
    entries(limit: $limit, sortBy: $order, offset: $offset) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        id
        date
        body
        user {
          id
          firstName
          lastName
        }
        createdAt
      }
    }
  }
`

export function useMGetEntriesQuery(options: Omit<Urql.UseQueryArgs<never, MGetEntriesQueryVariables>, "query">) {
  return Urql.useQuery<MGetEntriesQuery, MGetEntriesQueryVariables>({ query: MGetEntriesDocument, ...options })
}

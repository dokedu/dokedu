import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type DomainsQueryVariables = Types.Exact<{ [key: string]: never }>

export type DomainsQuery = {
  __typename?: "Query"
  domains?: {
    __typename?: "DomainConnection"
    edges?: Array<{ __typename?: "Domain"; id: string; name: string; createdAt: string } | null> | null
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; hasPreviousPage: boolean }
  } | null
}

export const DomainsDocument = gql`
  query domains {
    domains {
      edges {
        id
        name
        createdAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

export function useDomainsQuery(options: Omit<Urql.UseQueryArgs<never, DomainsQueryVariables>, "query">) {
  return Urql.useQuery<DomainsQuery, DomainsQueryVariables>({ query: DomainsDocument, ...options })
}

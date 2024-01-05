import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type DomainsQueryVariables = Types.Exact<{ [key: string]: never }>

export type DomainsQuery = { __typename?: "Query" } & {
  domains?: Types.Maybe<
    { __typename?: "DomainConnection" } & {
      edges?: Types.Maybe<
        Array<Types.Maybe<{ __typename?: "Domain" } & Pick<Types.Domain, "id" | "name" | "createdAt">>>
      >
      pageInfo: { __typename?: "PageInfo" } & Pick<Types.PageInfo, "hasNextPage" | "hasPreviousPage">
    }
  >
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

import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type EmailAccountsQueryVariables = Types.Exact<{ [key: string]: never }>

export type EmailAccountsQuery = { __typename?: "Query" } & {
  emailAccounts?: Types.Maybe<
    { __typename?: "EmailAccountConnection" } & Pick<Types.EmailAccountConnection, "totalCount"> & {
        edges?: Types.Maybe<
          Array<Types.Maybe<{ __typename?: "EmailAccount" } & Pick<Types.EmailAccount, "id" | "name" | "description">>>
        >
        pageInfo: { __typename?: "PageInfo" } & Pick<Types.PageInfo, "hasNextPage" | "hasPreviousPage">
      }
  >
}

export const EmailAccountsDocument = gql`
  query emailAccounts {
    emailAccounts(filter: { type: GROUP }) {
      edges {
        id
        name
        description
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

export function useEmailAccountsQuery(options: Omit<Urql.UseQueryArgs<never, EmailAccountsQueryVariables>, "query">) {
  return Urql.useQuery<EmailAccountsQuery, EmailAccountsQueryVariables>({ query: EmailAccountsDocument, ...options })
}

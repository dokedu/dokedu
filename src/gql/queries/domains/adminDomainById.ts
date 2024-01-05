import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type AdminDomainByIdQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type AdminDomainByIdQuery = { __typename?: "Query" } & {
  domain?: Types.Maybe<{ __typename?: "Domain" } & Pick<Types.Domain, "id" | "name" | "createdAt">>
}

export const AdminDomainByIdDocument = gql`
  query adminDomainById($id: ID!) {
    domain(id: $id) {
      id
      name
      createdAt
    }
  }
`

export function useAdminDomainByIdQuery(
  options: Omit<Urql.UseQueryArgs<never, AdminDomainByIdQueryVariables>, "query">
) {
  return Urql.useQuery<AdminDomainByIdQuery, AdminDomainByIdQueryVariables>({
    query: AdminDomainByIdDocument,
    ...options
  })
}

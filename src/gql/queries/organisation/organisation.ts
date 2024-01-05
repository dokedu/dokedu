import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type OrganisationQueryVariables = Types.Exact<{ [key: string]: never }>

export type OrganisationQuery = { __typename?: "Query" } & {
  organisation?: Types.Maybe<{ __typename?: "Organisation" } & Pick<Types.Organisation, "id" | "name" | "legalName">>
}

export const OrganisationDocument = gql`
  query organisation {
    organisation {
      id
      name
      legalName
    }
  }
`

export function useOrganisationQuery(options: Omit<Urql.UseQueryArgs<never, OrganisationQueryVariables>, "query">) {
  return Urql.useQuery<OrganisationQuery, OrganisationQueryVariables>({ query: OrganisationDocument, ...options })
}

import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type CompetenceSearchQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars["String"]["input"]>
  filter?: Types.InputMaybe<Types.CompetenceFilterInput>
}>

export type CompetenceSearchQuery = { __typename?: "Query" } & {
  competences: { __typename?: "CompetenceConnection" } & {
    edges?: Types.Maybe<
      Array<
        Types.Maybe<
          { __typename?: "Competence" } & Pick<Types.Competence, "id" | "name" | "type" | "color" | "grades"> & {
              parents: Array<
                { __typename?: "Competence" } & Pick<Types.Competence, "id" | "name" | "type" | "grades" | "color">
              >
            }
        >
      >
    >
  }
}

export const CompetenceSearchDocument = gql`
  query competenceSearch($search: String, $filter: CompetenceFilterInput) {
    competences(search: $search, filter: $filter, sort: { field: sort_order, order: asc }) {
      edges {
        id
        name
        type
        color
        grades
        parents {
          id
          name
          type
          grades
          color
        }
      }
    }
  }
`

export function useCompetenceSearchQuery(
  options: Omit<Urql.UseQueryArgs<never, CompetenceSearchQueryVariables>, "query">
) {
  return Urql.useQuery<CompetenceSearchQuery, CompetenceSearchQueryVariables>({
    query: CompetenceSearchDocument,
    ...options
  })
}

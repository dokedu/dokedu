import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type CompetenceSubjectsQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars["String"]["input"]>
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>
}>

export type CompetenceSubjectsQuery = { __typename?: "Query" } & {
  competences: { __typename?: "CompetenceConnection" } & {
    pageInfo: { __typename?: "PageInfo" } & Pick<Types.PageInfo, "hasNextPage" | "hasPreviousPage">
    edges?: Types.Maybe<
      Array<
        Types.Maybe<
          { __typename?: "Competence" } & Pick<
            Types.Competence,
            "id" | "name" | "type" | "grades" | "color" | "sortOrder"
          > & {
              parents: Array<{ __typename?: "Competence" } & Pick<Types.Competence, "id" | "name" | "type" | "grades">>
            }
        >
      >
    >
  }
}

export const CompetenceSubjectsDocument = gql`
  query competenceSubjects($search: String, $limit: Int, $offset: Int) {
    competences(
      filter: { type: subject }
      search: $search
      limit: $limit
      offset: $offset
      sort: { field: sort_order, order: asc }
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        id
        name
        type
        grades
        color
        sortOrder
        parents {
          id
          name
          type
          grades
        }
      }
    }
  }
`

export function useCompetenceSubjectsQuery(
  options: Omit<Urql.UseQueryArgs<never, CompetenceSubjectsQueryVariables>, "query">
) {
  return Urql.useQuery<CompetenceSubjectsQuery, CompetenceSubjectsQueryVariables>({
    query: CompetenceSubjectsDocument,
    ...options
  })
}

import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type SubjectsDataQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars["String"]["input"]>
}>

export type SubjectsDataQuery = { __typename?: "Query" } & {
  competences: { __typename?: "CompetenceConnection" } & {
    edges?: Types.Maybe<
      Array<
        Types.Maybe<{ __typename?: "Competence" } & Pick<Types.Competence, "id" | "name" | "type" | "color" | "grades">>
      >
    >
  }
}

export const SubjectsDataDocument = gql`
  query subjectsData($search: String) {
    competences(filter: { type: [subject] }, search: $search) {
      edges {
        id
        name
        type
        color
        grades
      }
    }
  }
`

export function useSubjectsDataQuery(options: Omit<Urql.UseQueryArgs<never, SubjectsDataQueryVariables>, "query">) {
  return Urql.useQuery<SubjectsDataQuery, SubjectsDataQueryVariables>({ query: SubjectsDataDocument, ...options })
}

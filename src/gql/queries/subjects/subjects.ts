import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type SubjectsQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>
}>

export type SubjectsQuery = {
  __typename?: "Query"
  subjects: {
    __typename?: "SubjectConnection"
    edges: Array<{ __typename?: "Subject"; id: string; name: string }>
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; hasPreviousPage: boolean }
  }
}

export const SubjectsDocument = gql`
  query subjects($limit: Int, $offset: Int) {
    subjects(limit: $limit, offset: $offset) {
      edges {
        id
        name
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

export function useSubjectsQuery(options: Omit<Urql.UseQueryArgs<never, SubjectsQueryVariables>, "query">) {
  return Urql.useQuery<SubjectsQuery, SubjectsQueryVariables>({ query: SubjectsDocument, ...options })
}

import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type ZeCompetenceParentsQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type ZeCompetenceParentsQuery = { __typename?: "Query" } & {
  competence: { __typename?: "Competence" } & Pick<Types.Competence, "id" | "name" | "type" | "grades"> & {
      parents: Array<{ __typename?: "Competence" } & Pick<Types.Competence, "id" | "name" | "type" | "grades">>
    }
}

export const ZeCompetenceParentsDocument = gql`
  query zeCompetenceParents($id: ID!) {
    competence(id: $id) {
      id
      name
      type
      grades
      parents {
        id
        name
        type
        grades
      }
    }
  }
`

export function useZeCompetenceParentsQuery(
  options: Omit<Urql.UseQueryArgs<never, ZeCompetenceParentsQueryVariables>, "query">
) {
  return Urql.useQuery<ZeCompetenceParentsQuery, ZeCompetenceParentsQueryVariables>({
    query: ZeCompetenceParentsDocument,
    ...options
  })
}

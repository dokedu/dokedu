import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type UpdateCompetenceMutationVariables = Types.Exact<{
  input: Types.UpdateCompetenceInput
}>

export type UpdateCompetenceMutation = { __typename?: "Mutation" } & {
  updateCompetence: { __typename?: "Competence" } & Pick<Types.Competence, "id" | "name" | "color">
}

export const UpdateCompetenceDocument = gql`
  mutation updateCompetence($input: UpdateCompetenceInput!) {
    updateCompetence(input: $input) {
      id
      name
      color
    }
  }
`

export function useUpdateCompetenceMutation() {
  return Urql.useMutation<UpdateCompetenceMutation, UpdateCompetenceMutationVariables>(UpdateCompetenceDocument)
}

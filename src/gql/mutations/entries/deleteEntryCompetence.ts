import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type DeleteEntryCompetenceInputMutationVariables = Types.Exact<{
  input: Types.DeleteEntryCompetenceInput
}>

export type DeleteEntryCompetenceInputMutation = {
  __typename?: "Mutation"
  deleteEntryCompetence: { __typename?: "Entry"; id: string }
}

export const DeleteEntryCompetenceInputDocument = gql`
  mutation deleteEntryCompetenceInput($input: DeleteEntryCompetenceInput!) {
    deleteEntryCompetence(input: $input) {
      id
    }
  }
`

export function useDeleteEntryCompetenceInputMutation() {
  return Urql.useMutation<DeleteEntryCompetenceInputMutation, DeleteEntryCompetenceInputMutationVariables>(
    DeleteEntryCompetenceInputDocument
  )
}

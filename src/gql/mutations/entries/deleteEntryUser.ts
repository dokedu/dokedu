import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type DeleteEntryUserInputMutationVariables = Types.Exact<{
  input: Types.DeleteEntryUserInput
}>

export type DeleteEntryUserInputMutation = {
  __typename?: "Mutation"
  deleteEntryUser: { __typename?: "Entry"; id: string }
}

export const DeleteEntryUserInputDocument = gql`
  mutation deleteEntryUserInput($input: DeleteEntryUserInput!) {
    deleteEntryUser(input: $input) {
      id
    }
  }
`

export function useDeleteEntryUserInputMutation() {
  return Urql.useMutation<DeleteEntryUserInputMutation, DeleteEntryUserInputMutationVariables>(
    DeleteEntryUserInputDocument
  )
}

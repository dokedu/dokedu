import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type DeleteEntryTagInputMutationVariables = Types.Exact<{
  input: Types.DeleteEntryTagInput
}>

export type DeleteEntryTagInputMutation = { __typename?: "Mutation" } & {
  deleteEntryTag: { __typename?: "Entry" } & Pick<Types.Entry, "id">
}

export const DeleteEntryTagInputDocument = gql`
  mutation deleteEntryTagInput($input: DeleteEntryTagInput!) {
    deleteEntryTag(input: $input) {
      id
    }
  }
`

export function useDeleteEntryTagInputMutation() {
  return Urql.useMutation<DeleteEntryTagInputMutation, DeleteEntryTagInputMutationVariables>(
    DeleteEntryTagInputDocument
  )
}

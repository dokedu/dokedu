import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type UpdateEntryMutationVariables = Types.Exact<{
  input: Types.UpdateEntryInput
}>

export type UpdateEntryMutation = { __typename?: "Mutation"; updateEntry: { __typename?: "Entry"; id: string } }

export const UpdateEntryDocument = gql`
  mutation updateEntry($input: UpdateEntryInput!) {
    updateEntry(input: $input) {
      id
    }
  }
`

export function useUpdateEntryMutation() {
  return Urql.useMutation<UpdateEntryMutation, UpdateEntryMutationVariables>(UpdateEntryDocument)
}

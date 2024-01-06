import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type CreateEntryEventMutationVariables = Types.Exact<{
  input: Types.CreateEntryEventInput
}>

export type CreateEntryEventMutation = {
  __typename?: "Mutation"
  createEntryEvent: { __typename?: "Entry"; id: string }
}

export const CreateEntryEventDocument = gql`
  mutation createEntryEvent($input: CreateEntryEventInput!) {
    createEntryEvent(input: $input) {
      id
    }
  }
`

export function useCreateEntryEventMutation() {
  return Urql.useMutation<CreateEntryEventMutation, CreateEntryEventMutationVariables>(CreateEntryEventDocument)
}

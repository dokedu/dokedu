import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type CreateTagMutationVariables = Types.Exact<{
  input: Types.CreateTagInput
}>

export type CreateTagMutation = {
  __typename?: "Mutation"
  createTag: { __typename?: "Tag"; id: string; name: string; color: string; deletedAt?: never | null; createdAt: never }
}

export const CreateTagDocument = gql`
  mutation createTag($input: CreateTagInput!) {
    createTag(input: $input) {
      id
      name
      color
      deletedAt
      createdAt
    }
  }
`

export function useCreateTagMutation() {
  return Urql.useMutation<CreateTagMutation, CreateTagMutationVariables>(CreateTagDocument)
}

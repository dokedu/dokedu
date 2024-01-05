import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type UpdateTagMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
  input: Types.CreateTagInput
}>

export type UpdateTagMutation = { __typename?: "Mutation" } & {
  updateTag: { __typename?: "Tag" } & Pick<Types.Tag, "id" | "name" | "color" | "deletedAt" | "createdAt">
}

export const UpdateTagDocument = gql`
  mutation updateTag($id: ID!, $input: CreateTagInput!) {
    updateTag(id: $id, input: $input) {
      id
      name
      color
      deletedAt
      createdAt
    }
  }
`

export function useUpdateTagMutation() {
  return Urql.useMutation<UpdateTagMutation, UpdateTagMutationVariables>(UpdateTagDocument)
}

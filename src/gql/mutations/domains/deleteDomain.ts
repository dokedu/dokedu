import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type DeleteDomainMutationVariables = Types.Exact<{
  input: Types.DeleteDomainInput
}>

export type DeleteDomainMutation = {
  __typename?: "Mutation"
  deleteDomain?: { __typename?: "Domain"; name: string; createdAt: string } | null
}

export const DeleteDomainDocument = gql`
  mutation deleteDomain($input: DeleteDomainInput!) {
    deleteDomain(input: $input) {
      name
      createdAt
    }
  }
`

export function useDeleteDomainMutation() {
  return Urql.useMutation<DeleteDomainMutation, DeleteDomainMutationVariables>(DeleteDomainDocument)
}

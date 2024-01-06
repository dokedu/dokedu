import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type CreateEmailGroupMutationVariables = Types.Exact<{
  input: Types.CreateEmailGroupInput
}>

export type CreateEmailGroupMutation = {
  __typename?: "Mutation"
  createEmailGroup?: {
    __typename?: "EmailAccount"
    id: string
    name: string
    description?: string | null
    members?: Array<{ __typename?: "EmailGroupMember"; name: string } | null> | null
  } | null
}

export const CreateEmailGroupDocument = gql`
  mutation createEmailGroup($input: CreateEmailGroupInput!) {
    createEmailGroup(input: $input) {
      id
      name
      description
      members {
        name
      }
    }
  }
`

export function useCreateEmailGroupMutation() {
  return Urql.useMutation<CreateEmailGroupMutation, CreateEmailGroupMutationVariables>(CreateEmailGroupDocument)
}

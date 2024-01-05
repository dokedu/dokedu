import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type UpdateUserMutationVariables = Types.Exact<{
  input: Types.UpdateUserInput
}>

export type UpdateUserMutation = { __typename?: "Mutation" } & {
  updateUser: { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName" | "email" | "role">
}

export const UpdateUserDocument = gql`
  mutation updateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      firstName
      lastName
      email
      role
    }
  }
`

export function useUpdateUserMutation() {
  return Urql.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument)
}

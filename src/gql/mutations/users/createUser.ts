import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type CreateUserMutationVariables = Types.Exact<{
  user: Types.CreateUserInput
}>

export type CreateUserMutation = { __typename?: "Mutation" } & {
  createUser: { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName">
}

export const CreateUserDocument = gql`
  mutation createUser($user: CreateUserInput!) {
    createUser(input: $user) {
      id
      firstName
      lastName
    }
  }
`

export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument)
}

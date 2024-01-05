import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type AddUserToChatMutationVariables = Types.Exact<{
  input: Types.AddUserToChatInput
}>

export type AddUserToChatMutation = { __typename?: "Mutation" } & {
  addUserToChat: { __typename?: "ChatUser" } & Pick<Types.ChatUser, "id"> & {
      chat: { __typename?: "Chat" } & Pick<Types.Chat, "id"> & {
          users: Array<{ __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "email">>
        }
    }
}

export const AddUserToChatDocument = gql`
  mutation addUserToChat($input: AddUserToChatInput!) {
    addUserToChat(input: $input) {
      id
      chat {
        id
        users {
          id
          firstName
          firstName
          email
        }
      }
    }
  }
`

export function useAddUserToChatMutation() {
  return Urql.useMutation<AddUserToChatMutation, AddUserToChatMutationVariables>(AddUserToChatDocument)
}

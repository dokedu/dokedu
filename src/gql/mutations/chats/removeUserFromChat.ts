import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type RemoveUserFromChatMutationVariables = Types.Exact<{
  input: Types.RemoveUserFromChatInput
}>

export type RemoveUserFromChatMutation = { __typename?: "Mutation" } & {
  removeUserFromChat: { __typename?: "ChatUser" } & Pick<Types.ChatUser, "id"> & {
      chat: { __typename?: "Chat" } & Pick<Types.Chat, "id"> & {
          users: Array<{ __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName" | "email">>
        }
    }
}

export const RemoveUserFromChatDocument = gql`
  mutation removeUserFromChat($input: RemoveUserFromChatInput!) {
    removeUserFromChat(input: $input) {
      id
      chat {
        id
        users {
          id
          firstName
          lastName
          email
        }
      }
    }
  }
`

export function useRemoveUserFromChatMutation() {
  return Urql.useMutation<RemoveUserFromChatMutation, RemoveUserFromChatMutationVariables>(RemoveUserFromChatDocument)
}

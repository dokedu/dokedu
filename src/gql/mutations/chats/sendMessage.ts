import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type SendMessageMutationVariables = Types.Exact<{
  input: Types.SendMessageInput
}>

export type SendMessageMutation = { __typename?: "Mutation" } & {
  sendMessage: { __typename?: "ChatMessage" } & Pick<Types.ChatMessage, "id"> & {
      chat: { __typename?: "Chat" } & Pick<Types.Chat, "id">
    }
}

export const SendMessageDocument = gql`
  mutation sendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      chat {
        id
      }
    }
  }
`

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument)
}

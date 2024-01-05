import type * as Types from "../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type MessageAddedSubscriptionVariables = Types.Exact<{
  chatId: Types.Scalars["ID"]["input"]
}>

export type MessageAddedSubscription = { __typename?: "Subscription" } & {
  messageAdded: { __typename?: "ChatMessage" } & Pick<Types.ChatMessage, "id" | "message"> & {
      chat: { __typename?: "Chat" } & Pick<Types.Chat, "id" | "lastMessage">
      user: { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName">
    }
}

export const MessageAddedDocument = gql`
  subscription messageAdded($chatId: ID!) {
    messageAdded(chatId: $chatId) {
      id
      chat {
        id
        lastMessage
      }
      user {
        id
        firstName
        lastName
      }
      message
    }
  }
`

export function useMessageAddedSubscription<R = MessageAddedSubscription>(
  options: Omit<Urql.UseSubscriptionArgs<never, MessageAddedSubscriptionVariables>, "query"> = {},
  handler?: Urql.SubscriptionHandlerArg<MessageAddedSubscription, R>
) {
  return Urql.useSubscription<MessageAddedSubscription, R, MessageAddedSubscriptionVariables>(
    { query: MessageAddedDocument, ...options },
    handler
  )
}

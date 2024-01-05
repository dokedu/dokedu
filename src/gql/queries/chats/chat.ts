import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type ChatQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type ChatQuery = { __typename?: "Query" } & {
  chat: { __typename?: "Chat" } & Pick<Types.Chat, "id" | "name"> & {
      messages: Array<
        { __typename?: "ChatMessage" } & Pick<Types.ChatMessage, "id" | "message" | "createdAt"> & {
            user: { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName">
          }
      >
    }
}

export const ChatDocument = gql`
  query chat($id: ID!) {
    chat(id: $id) {
      id
      name
      messages {
        id
        message
        user {
          id
          firstName
          lastName
        }
        createdAt
      }
    }
  }
`

export function useChatQuery(options: Omit<Urql.UseQueryArgs<never, ChatQueryVariables>, "query">) {
  return Urql.useQuery<ChatQuery, ChatQueryVariables>({ query: ChatDocument, ...options })
}

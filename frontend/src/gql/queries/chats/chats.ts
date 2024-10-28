import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ChatsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ChatsQuery = { __typename?: 'Query', chats: { __typename?: 'ChatConnection', edges?: Array<{ __typename?: 'Chat', id: string, name?: string | null, unreadMessageCount: number, lastMessage?: { __typename?: 'ChatMessage', id: string, message: string, createdAt: never } | null } | null> | null } };


export const ChatsDocument = gql`
    query chats {
  chats {
    edges {
      id
      name
      lastMessage {
        id
        message
        createdAt
      }
      unreadMessageCount
    }
  }
}
    `;

export function useChatsQuery(options?: Omit<Urql.UseQueryArgs<never, ChatsQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<ChatsQuery, ChatsQueryVariables | undefined>({ query: ChatsDocument, variables: undefined, ...options });
};
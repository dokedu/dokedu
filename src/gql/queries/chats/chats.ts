import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ChatsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ChatsQuery = (
  { __typename?: 'Query' }
  & { chats: (
    { __typename?: 'ChatConnection' }
    & { edges?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'Chat' }
      & Pick<Types.Chat, 'id' | 'name' | 'lastMessage'>
    )>>> }
  ) }
);


export const ChatsDocument = gql`
    query chats {
  chats {
    edges {
      id
      name
      lastMessage
    }
  }
}
    `;

export function useChatsQuery(options: Omit<Urql.UseQueryArgs<never, ChatsQueryVariables>, 'query'>) {
  return Urql.useQuery<ChatsQuery, ChatsQueryVariables>({ query: ChatsDocument, ...options });
};
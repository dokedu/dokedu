import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { ChatMessageFragmentDoc } from '../../fragments/chatMessage';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ChatQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ChatQuery = { __typename?: 'Query', chat: { __typename?: 'Chat', id: string, name?: string | null, type: Types.ChatType, userCount: number, messages: Array<{ __typename?: 'ChatMessage', id: string, message: string, isEdited: boolean, createdAt: never, user: { __typename?: 'User', id: string, firstName: string, lastName: string, email?: string | null } }>, users: Array<{ __typename?: 'User', id: string, firstName: string, lastSeenAt?: never | null }> } };


export const ChatDocument = gql`
    query chat($id: ID!) {
  chat(id: $id) {
    id
    name
    messages {
      ...chatMessage
    }
    type
    userCount
    users {
      id
      firstName
      lastSeenAt
    }
  }
}
    ${ChatMessageFragmentDoc}`;

export function useChatQuery(options: Omit<Urql.UseQueryArgs<never, ChatQueryVariables>, 'query'>) {
  return Urql.useQuery<ChatQuery, ChatQueryVariables>({ query: ChatDocument, ...options });
};
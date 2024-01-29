import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type MarkMessageAsReadMutationVariables = Types.Exact<{
  messageId: Types.Scalars['ID']['input'];
}>;


export type MarkMessageAsReadMutation = { __typename?: 'Mutation', markMessageAsRead: { __typename?: 'ChatMessage', id: string, createdAt: never, chat: { __typename: 'Chat', id: string, unreadMessageCount: number } } };


export const MarkMessageAsReadDocument = gql`
    mutation markMessageAsRead($messageId: ID!) {
  markMessageAsRead(messageId: $messageId) {
    id
    createdAt
    chat {
      __typename
      id
      unreadMessageCount
    }
  }
}
    `;

export function useMarkMessageAsReadMutation() {
  return Urql.useMutation<MarkMessageAsReadMutation, MarkMessageAsReadMutationVariables>(MarkMessageAsReadDocument);
};
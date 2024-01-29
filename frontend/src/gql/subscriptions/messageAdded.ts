import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type MessageAddedSubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type MessageAddedSubscription = { __typename?: 'Subscription', messageAdded: { __typename?: 'ChatMessage', id: string, message: string, chat: { __typename?: 'Chat', id: string, unreadMessageCount: number, lastMessage?: { __typename?: 'ChatMessage', id: string, message: string } | null }, user: { __typename?: 'User', id: string, firstName: string, lastName: string } } };


export const MessageAddedDocument = gql`
    subscription messageAdded {
  messageAdded {
    id
    chat {
      id
      unreadMessageCount
      lastMessage {
        id
        message
      }
    }
    user {
      id
      firstName
      lastName
    }
    message
  }
}
    `;

export function useMessageAddedSubscription<R = MessageAddedSubscription>(options: Omit<Urql.UseSubscriptionArgs<never, MessageAddedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandlerArg<MessageAddedSubscription, R>) {
  return Urql.useSubscription<MessageAddedSubscription, R, MessageAddedSubscriptionVariables>({ query: MessageAddedDocument, ...options }, handler);
};
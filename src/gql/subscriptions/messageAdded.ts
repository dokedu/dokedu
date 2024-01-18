import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type MessageAddedSubscriptionVariables = Types.Exact<{
  chatId: Types.Scalars['ID']['input'];
}>;


export type MessageAddedSubscription = { __typename?: 'Subscription', messageAdded: { __typename?: 'ChatMessage', id: string, message: string, chat: { __typename?: 'Chat', id: string, lastMessage?: { __typename?: 'ChatMessage', id: string, message: string } | null }, user: { __typename?: 'User', id: string, firstName: string, lastName: string } } };


export const MessageAddedDocument = gql`
    subscription messageAdded($chatId: ID!) {
  messageAdded(chatId: $chatId) {
    id
    chat {
      id
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
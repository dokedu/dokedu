import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SendMessageMutationVariables = Types.Exact<{
  input: Types.SendMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'ChatMessage', id: string, chat: { __typename?: 'Chat', id: string } } };


export const SendMessageDocument = gql`
    mutation sendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    id
    chat {
      id
    }
  }
}
    `;

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument);
};
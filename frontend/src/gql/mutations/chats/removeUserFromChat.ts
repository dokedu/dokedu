import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RemoveUserFromChatMutationVariables = Types.Exact<{
  input: Types.RemoveUserFromChatInput;
}>;


export type RemoveUserFromChatMutation = { __typename?: 'Mutation', removeUserFromChat: { __typename?: 'ChatUser', id: string, chat: { __typename?: 'Chat', id: string, users: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email?: string | null }> } } };


export const RemoveUserFromChatDocument = gql`
    mutation removeUserFromChat($input: RemoveUserFromChatInput!) {
  removeUserFromChat(input: $input) {
    id
    chat {
      id
      users {
        id
        firstName
        lastName
        email
      }
    }
  }
}
    `;

export function useRemoveUserFromChatMutation() {
  return Urql.useMutation<RemoveUserFromChatMutation, RemoveUserFromChatMutationVariables>(RemoveUserFromChatDocument);
};
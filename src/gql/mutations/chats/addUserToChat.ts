import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddUserToChatMutationVariables = Types.Exact<{
  input: Types.AddUserToChatInput;
}>;


export type AddUserToChatMutation = { __typename?: 'Mutation', addUserToChat: { __typename?: 'ChatUser', id: string, chat: { __typename?: 'Chat', id: string, users: Array<{ __typename?: 'User', id: string, firstName: string, email?: string | null }> } } };


export const AddUserToChatDocument = gql`
    mutation addUserToChat($input: AddUserToChatInput!) {
  addUserToChat(input: $input) {
    id
    chat {
      id
      users {
        id
        firstName
        firstName
        email
      }
    }
  }
}
    `;

export function useAddUserToChatMutation() {
  return Urql.useMutation<AddUserToChatMutation, AddUserToChatMutationVariables>(AddUserToChatDocument);
};
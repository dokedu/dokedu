import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateChatMutationVariables = Types.Exact<{
  input: Types.UpdateChatInput;
}>;


export type UpdateChatMutation = { __typename?: 'Mutation', updateChat: { __typename?: 'Chat', id: string, name?: string | null } };


export const UpdateChatDocument = gql`
    mutation updateChat($input: UpdateChatInput!) {
  updateChat(input: $input) {
    id
    name
  }
}
    `;

export function useUpdateChatMutation() {
  return Urql.useMutation<UpdateChatMutation, UpdateChatMutationVariables>(UpdateChatDocument);
};
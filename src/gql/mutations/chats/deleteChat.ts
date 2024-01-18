import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type DeleteChatMutationVariables = Types.Exact<{
  input: Types.DeleteChatInput;
}>;


export type DeleteChatMutation = { __typename?: 'Mutation', deleteChat: { __typename?: 'Chat', id: string, deletedAt?: never | null } };


export const DeleteChatDocument = gql`
    mutation deleteChat($input: DeleteChatInput!) {
  deleteChat(input: $input) {
    id
    deletedAt
  }
}
    `;

export function useDeleteChatMutation() {
  return Urql.useMutation<DeleteChatMutation, DeleteChatMutationVariables>(DeleteChatDocument);
};
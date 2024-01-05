import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type DeleteShareMutationVariables = Types.Exact<{
  input: Types.DeleteShareInput;
}>;


export type DeleteShareMutation = (
  { __typename?: 'Mutation' }
  & { deleteShare: (
    { __typename?: 'ShareUser' }
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id'>
    ) }
  ) }
);


export const DeleteShareDocument = gql`
    mutation deleteShare($input: DeleteShareInput!) {
  deleteShare(input: $input) {
    user {
      id
    }
  }
}
    `;

export function useDeleteShareMutation() {
  return Urql.useMutation<DeleteShareMutation, DeleteShareMutationVariables>(DeleteShareDocument);
};
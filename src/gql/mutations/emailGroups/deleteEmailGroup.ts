import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type DeleteEmailGroupMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteEmailGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteEmailGroup?: Types.Maybe<(
    { __typename?: 'EmailAccount' }
    & Pick<Types.EmailAccount, 'id' | 'name'>
  )> }
);


export const DeleteEmailGroupDocument = gql`
    mutation deleteEmailGroup($id: ID!) {
  deleteEmailGroup(id: $id) {
    id
    name
  }
}
    `;

export function useDeleteEmailGroupMutation() {
  return Urql.useMutation<DeleteEmailGroupMutation, DeleteEmailGroupMutationVariables>(DeleteEmailGroupDocument);
};
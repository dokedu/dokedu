import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EditShareMutationVariables = Types.Exact<{
  input: Types.CreateShareInput;
}>;


export type EditShareMutation = (
  { __typename?: 'Mutation' }
  & { editShare: (
    { __typename?: 'ShareUser' }
    & Pick<Types.ShareUser, 'permission'>
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstName' | 'lastName'>
    ) }
  ) }
);


export const EditShareDocument = gql`
    mutation editShare($input: CreateShareInput!) {
  editShare(input: $input) {
    permission
    user {
      id
      firstName
      lastName
    }
  }
}
    `;

export function useEditShareMutation() {
  return Urql.useMutation<EditShareMutation, EditShareMutationVariables>(EditShareDocument);
};
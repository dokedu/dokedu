import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateShareMutationVariables = Types.Exact<{
  input: Types.CreateShareInput;
}>;


export type CreateShareMutation = { __typename?: 'Mutation', createShare: { __typename?: 'ShareUser', permission: Types.FilePermission, user: { __typename?: 'User', id: string, firstName: string, lastName: string } } };


export const CreateShareDocument = gql`
    mutation createShare($input: CreateShareInput!) {
  createShare(input: $input) {
    permission
    user {
      id
      firstName
      lastName
    }
  }
}
    `;

export function useCreateShareMutation() {
  return Urql.useMutation<CreateShareMutation, CreateShareMutationVariables>(CreateShareDocument);
};
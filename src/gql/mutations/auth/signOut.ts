import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SignOutMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type SignOutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'signOut'>
);


export const SignOutDocument = gql`
    mutation signOut {
  signOut
}
    `;

export function useSignOutMutation() {
  return Urql.useMutation<SignOutMutation, SignOutMutationVariables>(SignOutDocument);
};
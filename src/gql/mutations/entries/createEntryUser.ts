import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateEntryUserMutationVariables = Types.Exact<{
  input: Types.CreateEntryUserInput;
}>;


export type CreateEntryUserMutation = { __typename?: 'Mutation', createEntryUser: { __typename?: 'Entry', id: string } };


export const CreateEntryUserDocument = gql`
    mutation createEntryUser($input: CreateEntryUserInput!) {
  createEntryUser(input: $input) {
    id
  }
}
    `;

export function useCreateEntryUserMutation() {
  return Urql.useMutation<CreateEntryUserMutation, CreateEntryUserMutationVariables>(CreateEntryUserDocument);
};
import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateEntryTagMutationVariables = Types.Exact<{
  input: Types.CreateEntryTagInput;
}>;


export type CreateEntryTagMutation = (
  { __typename?: 'Mutation' }
  & { createEntryTag: (
    { __typename?: 'Entry' }
    & Pick<Types.Entry, 'id'>
  ) }
);


export const CreateEntryTagDocument = gql`
    mutation createEntryTag($input: CreateEntryTagInput!) {
  createEntryTag(input: $input) {
    id
  }
}
    `;

export function useCreateEntryTagMutation() {
  return Urql.useMutation<CreateEntryTagMutation, CreateEntryTagMutationVariables>(CreateEntryTagDocument);
};
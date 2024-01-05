import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateEntryCompetenceMutationVariables = Types.Exact<{
  input: Types.CreateEntryCompetenceInput;
}>;


export type CreateEntryCompetenceMutation = (
  { __typename?: 'Mutation' }
  & { createEntryCompetence: (
    { __typename?: 'Entry' }
    & Pick<Types.Entry, 'id'>
  ) }
);


export const CreateEntryCompetenceDocument = gql`
    mutation createEntryCompetence($input: CreateEntryCompetenceInput!) {
  createEntryCompetence(input: $input) {
    id
  }
}
    `;

export function useCreateEntryCompetenceMutation() {
  return Urql.useMutation<CreateEntryCompetenceMutation, CreateEntryCompetenceMutationVariables>(CreateEntryCompetenceDocument);
};
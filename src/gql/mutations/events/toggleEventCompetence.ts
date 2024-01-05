import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ToggleEventCompetenceMutationVariables = Types.Exact<{
  input: Types.AddEventCompetenceInput;
}>;


export type ToggleEventCompetenceMutation = (
  { __typename?: 'Mutation' }
  & { toggleEventCompetence: (
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id'>
  ) }
);


export const ToggleEventCompetenceDocument = gql`
    mutation toggleEventCompetence($input: AddEventCompetenceInput!) {
  toggleEventCompetence(input: $input) {
    id
  }
}
    `;

export function useToggleEventCompetenceMutation() {
  return Urql.useMutation<ToggleEventCompetenceMutation, ToggleEventCompetenceMutationVariables>(ToggleEventCompetenceDocument);
};
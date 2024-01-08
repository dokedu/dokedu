import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateEntryUserCompetenceLevelMutationVariables = Types.Exact<{
  input: Types.UpdateEntryUserCompetenceLevel;
}>;


export type UpdateEntryUserCompetenceLevelMutation = { __typename?: 'Mutation', updateEntryUserCompetenceLevel: { __typename?: 'Entry', id: string } };


export const UpdateEntryUserCompetenceLevelDocument = gql`
    mutation updateEntryUserCompetenceLevel($input: UpdateEntryUserCompetenceLevel!) {
  updateEntryUserCompetenceLevel(input: $input) {
    id
  }
}
    `;

export function useUpdateEntryUserCompetenceLevelMutation() {
  return Urql.useMutation<UpdateEntryUserCompetenceLevelMutation, UpdateEntryUserCompetenceLevelMutationVariables>(UpdateEntryUserCompetenceLevelDocument);
};
import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateSchoolYearMutationVariables = Types.Exact<{
  year: Types.Scalars['Int']['input'];
}>;


export type CreateSchoolYearMutation = (
  { __typename?: 'Mutation' }
  & { createSchoolYear: (
    { __typename?: 'SchoolYear' }
    & Pick<Types.SchoolYear, 'id' | 'year' | 'description'>
  ) }
);


export const CreateSchoolYearDocument = gql`
    mutation createSchoolYear($year: Int!) {
  createSchoolYear(input: {year: $year}) {
    id
    year
    description
  }
}
    `;

export function useCreateSchoolYearMutation() {
  return Urql.useMutation<CreateSchoolYearMutation, CreateSchoolYearMutationVariables>(CreateSchoolYearDocument);
};
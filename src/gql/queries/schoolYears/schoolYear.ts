import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SchoolYearQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type SchoolYearQuery = (
  { __typename?: 'Query' }
  & { schoolYear: (
    { __typename?: 'SchoolYear' }
    & Pick<Types.SchoolYear, 'id' | 'year' | 'description'>
  ) }
);


export const SchoolYearDocument = gql`
    query schoolYear($id: ID!) {
  schoolYear(id: $id) {
    id
    year
    description
  }
}
    `;

export function useSchoolYearQuery(options: Omit<Urql.UseQueryArgs<never, SchoolYearQueryVariables>, 'query'>) {
  return Urql.useQuery<SchoolYearQuery, SchoolYearQueryVariables>({ query: SchoolYearDocument, ...options });
};
import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SchoolYearsQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type SchoolYearsQuery = { __typename?: 'Query', schoolYears: { __typename?: 'SchoolYearConnection', edges: Array<{ __typename?: 'SchoolYear', id: string, year: number, description: string }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };


export const SchoolYearsDocument = gql`
    query schoolYears($limit: Int, $offset: Int) {
  schoolYears(limit: $limit, offset: $offset) {
    edges {
      id
      year
      description
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useSchoolYearsQuery(options: Omit<Urql.UseQueryArgs<never, SchoolYearsQueryVariables>, 'query'>) {
  return Urql.useQuery<SchoolYearsQuery, SchoolYearsQueryVariables>({ query: SchoolYearsDocument, ...options });
};
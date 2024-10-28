import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CompetenceQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  filter?: Types.InputMaybe<Types.CompetenceFilterInput>;
}>;


export type CompetenceQuery = { __typename?: 'Query', competences: { __typename?: 'CompetenceConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean }, edges?: Array<{ __typename?: 'Competence', id: string, name: string, type: Types.CompetenceType, grades: Array<number>, color: string, sortOrder: number, parents: Array<{ __typename?: 'Competence', id: string, name: string, type: Types.CompetenceType, grades: Array<number> }> } | null> | null } };


export const CompetenceDocument = gql`
    query competence($search: String, $limit: Int, $offset: Int, $filter: CompetenceFilterInput) {
  competences(
    filter: $filter
    search: $search
    limit: $limit
    offset: $offset
    sort: {field: sort_order, order: asc}
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      id
      name
      type
      grades
      color
      sortOrder
      parents {
        id
        name
        type
        grades
      }
    }
  }
}
    `;

export function useCompetenceQuery(options?: Omit<Urql.UseQueryArgs<never, CompetenceQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<CompetenceQuery, CompetenceQueryVariables | undefined>({ query: CompetenceDocument, variables: undefined, ...options });
};
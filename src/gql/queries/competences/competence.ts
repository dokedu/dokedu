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


export type CompetenceQuery = (
  { __typename?: 'Query' }
  & { competences: (
    { __typename?: 'CompetenceConnection' }
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage'>
    ), edges?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'Competence' }
      & Pick<Types.Competence, 'id' | 'name' | 'type' | 'grades' | 'color' | 'sortOrder'>
      & { parents: Array<(
        { __typename?: 'Competence' }
        & Pick<Types.Competence, 'id' | 'name' | 'type' | 'grades'>
      )> }
    )>>> }
  ) }
);


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

export function useCompetenceQuery(options: Omit<Urql.UseQueryArgs<never, CompetenceQueryVariables>, 'query'>) {
  return Urql.useQuery<CompetenceQuery, CompetenceQueryVariables>({ query: CompetenceDocument, ...options });
};
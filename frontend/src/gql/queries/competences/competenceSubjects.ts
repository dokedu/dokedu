import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CompetenceSubjectsQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type CompetenceSubjectsQuery = { __typename?: 'Query', competences: { __typename?: 'CompetenceConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean }, edges?: Array<{ __typename?: 'Competence', id: string, name: string, type: Types.CompetenceType, grades: Array<number>, color: string, sortOrder: number, parents: Array<{ __typename?: 'Competence', id: string, name: string, type: Types.CompetenceType, grades: Array<number> }> } | null> | null } };


export const CompetenceSubjectsDocument = gql`
    query competenceSubjects($search: String, $limit: Int, $offset: Int) {
  competences(
    filter: {type: subject}
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

export function useCompetenceSubjectsQuery(options: Omit<Urql.UseQueryArgs<never, CompetenceSubjectsQueryVariables>, 'query'>) {
  return Urql.useQuery<CompetenceSubjectsQuery, CompetenceSubjectsQueryVariables>({ query: CompetenceSubjectsDocument, ...options });
};
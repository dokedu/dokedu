import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type StudentCompetencesQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type StudentCompetencesQuery = { __typename?: 'Query', competences: { __typename?: 'CompetenceConnection', edges?: Array<{ __typename?: 'Competence', id: string, name: string, grades: Array<number>, tendency?: { __typename?: 'CompetenceTendency', tendency: number, countChildCompetences: number, countLearnedCompetences: number } | null } | null> | null } };


export const StudentCompetencesDocument = gql`
    query studentCompetences($userId: ID!) {
  competences(
    filter: {type: subject}
    limit: 100
    sort: {field: sort_order, order: asc}
  ) {
    edges {
      id
      name
      grades
      tendency(userId: $userId) {
        tendency
        countChildCompetences
        countLearnedCompetences
      }
    }
  }
}
    `;

export function useStudentCompetencesQuery(options: Omit<Urql.UseQueryArgs<never, StudentCompetencesQueryVariables>, 'query'>) {
  return Urql.useQuery<StudentCompetencesQuery, StudentCompetencesQueryVariables>({ query: StudentCompetencesDocument, ...options });
};
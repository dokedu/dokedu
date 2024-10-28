import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type StudentCompetenceQueryVariables = Types.Exact<{
  competenceId: Types.Scalars['ID']['input'];
  user: Types.Scalars['ID']['input'];
}>;


export type StudentCompetenceQuery = { __typename?: 'Query', competence: { __typename?: 'Competence', id: string, name: string, parents: Array<{ __typename?: 'Competence', id: string, name: string }>, competences: Array<{ __typename?: 'Competence', type: Types.CompetenceType, id: string, name: string, grades: Array<number>, parents: Array<{ __typename?: 'Competence', id: string, name: string }>, tendency?: { __typename?: 'CompetenceTendency', tendency: number, countChildCompetences: number, countLearnedCompetences: number } | null, userCompetences: Array<{ __typename?: 'UserCompetence', id: string, level: number, createdAt: never, entry?: { __typename?: 'Entry', id: string } | null, createdBy?: { __typename?: 'User', firstName: string, lastName: string } | null } | null> } | null> } };


export const StudentCompetenceDocument = gql`
    query studentCompetence($competenceId: ID!, $user: ID!) {
  competence(id: $competenceId) {
    id
    name
    parents {
      id
      name
    }
    competences(sort: {field: sort_order, order: asc}) {
      type
      id
      name
      grades
      parents {
        id
        name
      }
      tendency(userId: $user) {
        tendency
        countChildCompetences
        countLearnedCompetences
      }
      userCompetences(userId: $user) {
        id
        level
        entry {
          id
        }
        createdBy {
          firstName
          lastName
        }
        createdAt
      }
    }
  }
}
    `;

export function useStudentCompetenceQuery(options?: Omit<Urql.UseQueryArgs<never, StudentCompetenceQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<StudentCompetenceQuery, StudentCompetenceQueryVariables | undefined>({ query: StudentCompetenceDocument, variables: undefined, ...options });
};
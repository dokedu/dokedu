import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UserStudentGradeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type UserStudentGradeQuery = { __typename?: 'Query', userStudentGrade: { __typename?: 'UserStudentGrades', id: string, grade: number, student: { __typename?: 'UserStudent', id: string, user: { __typename?: 'User', id: string, firstName: string, lastName: string } }, subject: { __typename?: 'Subject', id: string, name: string }, schoolYear: { __typename?: 'SchoolYear', id: string, year: number, description: string } } };


export const UserStudentGradeDocument = gql`
    query userStudentGrade($id: ID!) {
  userStudentGrade(id: $id) {
    id
    grade
    student {
      id
      user {
        id
        firstName
        lastName
      }
    }
    subject {
      id
      name
    }
    schoolYear {
      id
      year
      description
    }
  }
}
    `;

export function useUserStudentGradeQuery(options: Omit<Urql.UseQueryArgs<never, UserStudentGradeQueryVariables>, 'query'>) {
  return Urql.useQuery<UserStudentGradeQuery, UserStudentGradeQueryVariables>({ query: UserStudentGradeDocument, ...options });
};
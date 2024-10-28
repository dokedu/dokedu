import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UserStudentGradesQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type UserStudentGradesQuery = { __typename?: 'Query', userStudentGrades: { __typename?: 'UserStudentGradesConnection', edges: Array<{ __typename?: 'UserStudentGrades', id: string, grade: number, student: { __typename?: 'UserStudent', id: string, user: { __typename?: 'User', id: string, firstName: string, lastName: string } }, subject: { __typename?: 'Subject', id: string, name: string }, schoolYear: { __typename?: 'SchoolYear', id: string, year: number, description: string } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };


export const UserStudentGradesDocument = gql`
    query userStudentGrades($limit: Int, $offset: Int) {
  userStudentGrades(limit: $limit, offset: $offset) {
    edges {
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
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useUserStudentGradesQuery(options?: Omit<Urql.UseQueryArgs<never, UserStudentGradesQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<UserStudentGradesQuery, UserStudentGradesQueryVariables | undefined>({ query: UserStudentGradesDocument, variables: undefined, ...options });
};
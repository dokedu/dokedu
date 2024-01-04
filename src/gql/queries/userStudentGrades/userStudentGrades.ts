import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UserStudentGradesQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type UserStudentGradesQuery = (
  { __typename?: 'Query' }
  & { userStudentGrades: (
    { __typename?: 'UserStudentGradesConnection' }
    & { edges: Array<(
      { __typename?: 'UserStudentGrades' }
      & Pick<Types.UserStudentGrades, 'id' | 'grade'>
      & { student: (
        { __typename?: 'UserStudent' }
        & Pick<Types.UserStudent, 'id'>
        & { user: (
          { __typename?: 'User' }
          & Pick<Types.User, 'id' | 'firstName' | 'lastName'>
        ) }
      ), subject: (
        { __typename?: 'Subject' }
        & Pick<Types.Subject, 'id' | 'name'>
      ), schoolYear: (
        { __typename?: 'SchoolYear' }
        & Pick<Types.SchoolYear, 'id' | 'year' | 'description'>
      ) }
    )>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage'>
    ) }
  ) }
);


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

export function useUserStudentGradesQuery(options: Omit<Urql.UseQueryArgs<never, UserStudentGradesQueryVariables>, 'query'>) {
  return Urql.useQuery<UserStudentGradesQuery, UserStudentGradesQueryVariables>({ query: UserStudentGradesDocument, ...options });
};
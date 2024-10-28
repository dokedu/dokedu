import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type StudentListQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type StudentListQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', edges?: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, student?: { __typename?: 'UserStudent', id: string, grade: number, emoji?: string | null } | null } | null> | null } };


export const StudentListDocument = gql`
    query studentList($search: String) {
  users(
    filter: {role: [student], orderBy: lastNameAsc}
    search: $search
    limit: 1000
  ) {
    edges {
      id
      firstName
      lastName
      student {
        id
        grade
        emoji
      }
    }
  }
}
    `;

export function useStudentListQuery(options?: Omit<Urql.UseQueryArgs<never, StudentListQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<StudentListQuery, StudentListQueryVariables | undefined>({ query: StudentListDocument, variables: undefined, ...options });
};
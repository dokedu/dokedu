import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AdminStudentsQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
  order?: Types.InputMaybe<Types.UserOrderBy>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  showDeleted?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type AdminStudentsQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean }, edges?: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, student?: { __typename?: 'UserStudent', id: string, birthday?: never | null, grade: number, emoji?: string | null } | null } | null> | null } };


export const AdminStudentsDocument = gql`
    query adminStudents($search: String, $order: UserOrderBy, $offset: Int, $showDeleted: Boolean) {
  users(
    filter: {role: [student], orderBy: $order, showDeleted: $showDeleted}
    search: $search
    offset: $offset
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      id
      firstName
      lastName
      student {
        id
        birthday
        grade
        emoji
      }
    }
  }
}
    `;

export function useAdminStudentsQuery(options: Omit<Urql.UseQueryArgs<never, AdminStudentsQueryVariables>, 'query'>) {
  return Urql.useQuery<AdminStudentsQuery, AdminStudentsQueryVariables>({ query: AdminStudentsDocument, ...options });
};
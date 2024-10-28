import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AdminUsersQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
  order?: Types.InputMaybe<Types.UserOrderBy>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  showDeleted?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type AdminUsersQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean }, edges?: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email?: string | null } | null> | null } };


export const AdminUsersDocument = gql`
    query adminUsers($search: String, $order: UserOrderBy, $offset: Int, $showDeleted: Boolean) {
  users(
    filter: {role: [owner, admin, teacher], orderBy: $order, showDeleted: $showDeleted}
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
      email
    }
  }
}
    `;

export function useAdminUsersQuery(options?: Omit<Urql.UseQueryArgs<never, AdminUsersQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<AdminUsersQuery, AdminUsersQueryVariables | undefined>({ query: AdminUsersDocument, variables: undefined, ...options });
};
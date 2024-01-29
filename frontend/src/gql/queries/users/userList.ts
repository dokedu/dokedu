import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UserListQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type UserListQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', edges?: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email?: string | null } | null> | null } };


export const UserListDocument = gql`
    query userList($search: String) {
  users(search: $search) {
    edges {
      id
      firstName
      lastName
      email
    }
  }
}
    `;

export function useUserListQuery(options: Omit<Urql.UseQueryArgs<never, UserListQueryVariables>, 'query'>) {
  return Urql.useQuery<UserListQuery, UserListQueryVariables>({ query: UserListDocument, ...options });
};
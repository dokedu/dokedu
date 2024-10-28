import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UsersQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', edges?: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string } | null> | null } };


export const UsersDocument = gql`
    query users($search: String) {
  users(
    filter: {role: [student], orderBy: lastNameAsc}
    search: $search
    limit: 1000
  ) {
    edges {
      id
      firstName
      lastName
    }
  }
}
    `;

export function useUsersQuery(options?: Omit<Urql.UseQueryArgs<never, UsersQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<UsersQuery, UsersQueryVariables | undefined>({ query: UsersDocument, variables: undefined, ...options });
};
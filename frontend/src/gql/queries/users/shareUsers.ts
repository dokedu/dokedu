import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ShareUsersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ShareUsersQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', edges?: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string } | null> | null } };


export const ShareUsersDocument = gql`
    query shareUsers {
  users(filter: {role: [owner, admin, teacher]}) {
    edges {
      id
      firstName
      lastName
    }
  }
}
    `;

export function useShareUsersQuery(options: Omit<Urql.UseQueryArgs<never, ShareUsersQueryVariables>, 'query'>) {
  return Urql.useQuery<ShareUsersQuery, ShareUsersQueryVariables>({ query: ShareUsersDocument, ...options });
};
import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GroupUsersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GroupUsersQuery = { __typename?: 'Query', emailAccounts?: { __typename?: 'EmailAccountConnection', edges?: Array<{ __typename?: 'EmailAccount', id: string, name: string } | null> | null } | null };


export const GroupUsersDocument = gql`
    query groupUsers {
  emailAccounts(filter: {type: INDIVIDUAL}) {
    edges {
      id
      name
    }
  }
}
    `;

export function useGroupUsersQuery(options?: Omit<Urql.UseQueryArgs<never, GroupUsersQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GroupUsersQuery, GroupUsersQueryVariables | undefined>({ query: GroupUsersDocument, variables: undefined, ...options });
};
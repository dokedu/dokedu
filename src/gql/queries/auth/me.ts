import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type MeQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, role: Types.UserRole, email?: string | null, firstName: string, lastName: string } };


export const MeDocument = gql`
    query me {
  me {
    id
    role
    email
    firstName
    lastName
  }
}
    `;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<never, MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};
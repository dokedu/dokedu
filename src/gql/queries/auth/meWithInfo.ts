import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type MeWithInfoQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MeWithInfoQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, role: Types.UserRole, email?: string | null, firstName: string, lastName: string } };


export const MeWithInfoDocument = gql`
    query meWithInfo {
  me {
    id
    role
    email
    firstName
    lastName
  }
}
    `;

export function useMeWithInfoQuery(options: Omit<Urql.UseQueryArgs<never, MeWithInfoQueryVariables>, 'query'>) {
  return Urql.useQuery<MeWithInfoQuery, MeWithInfoQueryVariables>({ query: MeWithInfoDocument, ...options });
};
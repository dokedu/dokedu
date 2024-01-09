import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type InviteDetailsQueryVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
}>;


export type InviteDetailsQuery = { __typename?: 'Query', inviteDetails: { __typename?: 'InviteDetailsPayload', email: string, firstName: string, lastName: string } };


export const InviteDetailsDocument = gql`
    query inviteDetails($token: String!) {
  inviteDetails(token: $token) {
    email
    firstName
    lastName
  }
}
    `;

export function useInviteDetailsQuery(options: Omit<Urql.UseQueryArgs<never, InviteDetailsQueryVariables>, 'query'>) {
  return Urql.useQuery<InviteDetailsQuery, InviteDetailsQueryVariables>({ query: InviteDetailsDocument, ...options });
};
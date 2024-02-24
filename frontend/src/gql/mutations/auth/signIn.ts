import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { UserFragmentDoc } from '../../fragments/user';
import { OrganisationFragmentDoc } from '../../fragments/organisation';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SignInMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'SignInPayload', token: string, user: { __typename?: 'User', id: string, role: Types.UserRole, email?: string | null, firstName: string, lastName: string, organisationId: string, language?: Types.UserLanguage | null }, organisation: { __typename?: 'Organisation', id: string, name: string, legalName: string, applications: Array<Types.OrganisationApplication>, phone?: string | null, website?: string | null, owner: { __typename?: 'User', id: string, role: Types.UserRole, email?: string | null, firstName: string, lastName: string, organisationId: string, language?: Types.UserLanguage | null } } } };


export const SignInDocument = gql`
    mutation signIn($email: String!, $password: String!) {
  signIn(input: {email: $email, password: $password}) {
    token
    user {
      ...user
    }
    organisation {
      ...organisation
    }
  }
}
    ${UserFragmentDoc}
${OrganisationFragmentDoc}`;

export function useSignInMutation() {
  return Urql.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument);
};
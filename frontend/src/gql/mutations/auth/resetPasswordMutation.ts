import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { UserFragmentDoc } from '../../fragments/user';
import { OrganisationFragmentDoc } from '../../fragments/organisation';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ResetPasswordMutationVariables = Types.Exact<{
  input: Types.ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'ResetPasswordPayload', token: string, user: { __typename?: 'User', id: string, role: Types.UserRole, email?: string | null, firstName: string, lastName: string, organisationId: string, language?: Types.UserLanguage | null }, organisation: { __typename?: 'Organisation', id: string, name: string, legalName: string, applications: Array<Types.OrganisationApplication>, phone?: string | null, website?: string | null, owner: { __typename?: 'User', id: string, role: Types.UserRole, email?: string | null, firstName: string, lastName: string, organisationId: string, language?: Types.UserLanguage | null } } } };


export const ResetPasswordDocument = gql`
    mutation resetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input) {
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

export function useResetPasswordMutation() {
  return Urql.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument);
};
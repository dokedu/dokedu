import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { UserFragmentDoc } from '../../fragments/user';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type VerifyOtpMutationVariables = Types.Exact<{
  input: Types.VerifyOtpInput;
}>;


export type VerifyOtpMutation = { __typename?: 'Mutation', verifyOtp: { __typename?: 'VerifyOtpPayload', token: string, user: { __typename?: 'User', id: string, role: Types.UserRole, email?: string | null, firstName: string, lastName: string, organisationId: string } } };


export const VerifyOtpDocument = gql`
    mutation verifyOtp($input: VerifyOtpInput!) {
  verifyOtp(input: $input) {
    token
    user {
      ...user
    }
  }
}
    ${UserFragmentDoc}`;

export function useVerifyOtpMutation() {
  return Urql.useMutation<VerifyOtpMutation, VerifyOtpMutationVariables>(VerifyOtpDocument);
};
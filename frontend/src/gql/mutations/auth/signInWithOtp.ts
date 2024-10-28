import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SignInWithOtpMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
}>;


export type SignInWithOtpMutation = { __typename?: 'Mutation', signInWithOtp: { __typename: 'SignInWithOtpPayload' } };


export const SignInWithOtpDocument = gql`
    mutation signInWithOtp($email: String!) {
  signInWithOtp(input: {email: $email}) {
    __typename
  }
}
    `;

export function useSignInWithOtpMutation() {
  return Urql.useMutation<SignInWithOtpMutation, SignInWithOtpMutationVariables>(SignInWithOtpDocument);
};
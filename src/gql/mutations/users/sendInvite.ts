import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SendInviteMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type SendInviteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'sendUserInvite'>
);


export const SendInviteDocument = gql`
    mutation sendInvite($id: ID!) {
  sendUserInvite(id: $id)
}
    `;

export function useSendInviteMutation() {
  return Urql.useMutation<SendInviteMutation, SendInviteMutationVariables>(SendInviteDocument);
};
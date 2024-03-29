import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EditEmailGroupMutationVariables = Types.Exact<{
  input: Types.UpdateEmailGroupInput;
}>;


export type EditEmailGroupMutation = { __typename?: 'Mutation', updateEmailGroup?: { __typename?: 'EmailAccount', id: string, name: string, description?: string | null } | null };


export const EditEmailGroupDocument = gql`
    mutation editEmailGroup($input: UpdateEmailGroupInput!) {
  updateEmailGroup(input: $input) {
    id
    name
    description
  }
}
    `;

export function useEditEmailGroupMutation() {
  return Urql.useMutation<EditEmailGroupMutation, EditEmailGroupMutationVariables>(EditEmailGroupDocument);
};
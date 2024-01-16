import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RemoveFileFromEntryMutationVariables = Types.Exact<{
  entryId: Types.Scalars['ID']['input'];
  fileId: Types.Scalars['ID']['input'];
}>;


export type RemoveFileFromEntryMutation = { __typename?: 'Mutation', removeFileFromEntry: { __typename?: 'Entry', id: string } };


export const RemoveFileFromEntryDocument = gql`
    mutation removeFileFromEntry($entryId: ID!, $fileId: ID!) {
  removeFileFromEntry(entryId: $entryId, fileId: $fileId) {
    id
  }
}
    `;

export function useRemoveFileFromEntryMutation() {
  return Urql.useMutation<RemoveFileFromEntryMutation, RemoveFileFromEntryMutationVariables>(RemoveFileFromEntryDocument);
};
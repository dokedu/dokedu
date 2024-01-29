import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UploadFileToEntryMutationVariables = Types.Exact<{
  entryId: Types.Scalars['ID']['input'];
  file: Types.Scalars['Upload']['input'];
}>;


export type UploadFileToEntryMutation = { __typename?: 'Mutation', uploadFileToEntry: { __typename?: 'Entry', id: string } };


export const UploadFileToEntryDocument = gql`
    mutation uploadFileToEntry($entryId: ID!, $file: Upload!) {
  uploadFileToEntry(entryId: $entryId, file: $file) {
    id
  }
}
    `;

export function useUploadFileToEntryMutation() {
  return Urql.useMutation<UploadFileToEntryMutation, UploadFileToEntryMutationVariables>(UploadFileToEntryDocument);
};
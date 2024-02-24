import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { FileFragmentDoc } from '../../fragments/file';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type DeleteFileMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile: { __typename?: 'DeleteFilePayload', file: { __typename?: 'File', id: string, name: string, mime: string, size: number, type: Types.FileType, createdAt: never, deletedAt?: never | null } } };


export const DeleteFileDocument = gql`
    mutation deleteFile($id: ID!) {
  deleteFile(input: {id: $id}) {
    file {
      ...file
    }
  }
}
    ${FileFragmentDoc}`;

export function useDeleteFileMutation() {
  return Urql.useMutation<DeleteFileMutation, DeleteFileMutationVariables>(DeleteFileDocument);
};
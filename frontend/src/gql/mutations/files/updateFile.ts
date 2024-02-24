import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { FileFragmentDoc } from '../../fragments/file';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateFileMutationVariables = Types.Exact<{
  input: Types.UpdateFileInput;
}>;


export type UpdateFileMutation = { __typename?: 'Mutation', updateFile: { __typename?: 'UpdateFilePayload', file: { __typename?: 'File', id: string, name: string, mime: string, size: number, type: Types.FileType, createdAt: never, deletedAt?: never | null } } };


export const UpdateFileDocument = gql`
    mutation updateFile($input: UpdateFileInput!) {
  updateFile(input: $input) {
    file {
      ...file
    }
  }
}
    ${FileFragmentDoc}`;

export function useUpdateFileMutation() {
  return Urql.useMutation<UpdateFileMutation, UpdateFileMutationVariables>(UpdateFileDocument);
};
import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { FileFragmentDoc } from '../../fragments/file';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateFileMutationVariables = Types.Exact<{
  input: Types.CreateFileInput;
}>;


export type CreateFileMutation = { __typename?: 'Mutation', createFile: { __typename?: 'CreateFilePayload', file: { __typename?: 'File', id: string, name: string, mime: string, size: number, type: Types.FileType, createdAt: never, deletedAt?: never | null } } };


export const CreateFileDocument = gql`
    mutation createFile($input: CreateFileInput!) {
  createFile(input: $input) {
    file {
      ...file
    }
  }
}
    ${FileFragmentDoc}`;

export function useCreateFileMutation() {
  return Urql.useMutation<CreateFileMutation, CreateFileMutationVariables>(CreateFileDocument);
};
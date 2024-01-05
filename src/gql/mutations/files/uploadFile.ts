import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UploadFileMutationVariables = Types.Exact<{
  input: Types.FileUploadInput;
}>;


export type UploadFileMutation = (
  { __typename?: 'Mutation' }
  & { uploadFile: (
    { __typename?: 'File' }
    & Pick<Types.File, 'id'>
  ) }
);


export const UploadFileDocument = gql`
    mutation uploadFile($input: FileUploadInput!) {
  uploadFile(input: $input) {
    id
  }
}
    `;

export function useUploadFileMutation() {
  return Urql.useMutation<UploadFileMutation, UploadFileMutationVariables>(UploadFileDocument);
};
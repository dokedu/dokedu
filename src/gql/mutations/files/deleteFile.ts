import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type DeleteFileMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteFileMutation = (
  { __typename?: 'Mutation' }
  & { deleteFile: (
    { __typename?: 'DeleteFilePayload' }
    & Pick<Types.DeleteFilePayload, 'success'>
    & { file: (
      { __typename?: 'File' }
      & Pick<Types.File, 'id'>
    ) }
  ) }
);


export const DeleteFileDocument = gql`
    mutation deleteFile($id: ID!) {
  deleteFile(input: {id: $id}) {
    success
    file {
      id
    }
  }
}
    `;

export function useDeleteFileMutation() {
  return Urql.useMutation<DeleteFileMutation, DeleteFileMutationVariables>(DeleteFileDocument);
};
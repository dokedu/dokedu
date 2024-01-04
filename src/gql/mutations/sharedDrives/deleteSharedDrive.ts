import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type DeleteSharedDriveMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteSharedDriveMutation = (
  { __typename?: 'Mutation' }
  & { deleteSharedDrive: (
    { __typename?: 'Bucket' }
    & Pick<Types.Bucket, 'id'>
  ) }
);


export const DeleteSharedDriveDocument = gql`
    mutation deleteSharedDrive($id: ID!) {
  deleteSharedDrive(id: $id) {
    id
  }
}
    `;

export function useDeleteSharedDriveMutation() {
  return Urql.useMutation<DeleteSharedDriveMutation, DeleteSharedDriveMutationVariables>(DeleteSharedDriveDocument);
};
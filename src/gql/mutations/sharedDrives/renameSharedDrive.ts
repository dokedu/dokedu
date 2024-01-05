import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RenameSharedDriveMutationVariables = Types.Exact<{
  input: Types.RenameSharedDriveInput;
}>;


export type RenameSharedDriveMutation = (
  { __typename?: 'Mutation' }
  & { renameSharedDrive: (
    { __typename?: 'Bucket' }
    & Pick<Types.Bucket, 'id' | 'name'>
  ) }
);


export const RenameSharedDriveDocument = gql`
    mutation renameSharedDrive($input: RenameSharedDriveInput!) {
  renameSharedDrive(input: $input) {
    id
    name
  }
}
    `;

export function useRenameSharedDriveMutation() {
  return Urql.useMutation<RenameSharedDriveMutation, RenameSharedDriveMutationVariables>(RenameSharedDriveDocument);
};
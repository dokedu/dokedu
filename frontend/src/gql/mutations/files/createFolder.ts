import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateFolderMutationVariables = Types.Exact<{
  input: Types.CreateFolderInput;
}>;


export type CreateFolderMutation = { __typename?: 'Mutation', createFolder: { __typename?: 'File', id: string } };


export const CreateFolderDocument = gql`
    mutation createFolder($input: CreateFolderInput!) {
  createFolder(input: $input) {
    id
  }
}
    `;

export function useCreateFolderMutation() {
  return Urql.useMutation<CreateFolderMutation, CreateFolderMutationVariables>(CreateFolderDocument);
};
import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { FileFragmentDoc } from '../../fragments/file';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FilesQueryVariables = Types.Exact<{
  input: Types.FileFilterInput;
}>;


export type FilesQuery = { __typename?: 'Query', files: { __typename?: 'FileConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'File', id: string, name: string, mime: string, size: number, type: Types.FileType, createdAt: never, deletedAt?: never | null }> } };


export const FilesDocument = gql`
    query files($input: FileFilterInput!) {
  files(input: $input) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      ...file
    }
  }
}
    ${FileFragmentDoc}`;

export function useFilesQuery(options: Omit<Urql.UseQueryArgs<never, FilesQueryVariables>, 'query'>) {
  return Urql.useQuery<FilesQuery, FilesQueryVariables>({ query: FilesDocument, ...options });
};
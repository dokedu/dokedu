import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { FileFragmentDoc } from '../../fragments/file';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FileByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type FileByIdQuery = { __typename?: 'Query', file: { __typename?: 'File', id: string, name: string, mime: string, size: number, type: Types.FileType, createdAt: never, deletedAt?: never | null, parentsRecursive: Array<{ __typename?: 'File', id: string, name: string, mime: string, size: number, type: Types.FileType, createdAt: never, deletedAt?: never | null }> } };


export const FileByIdDocument = gql`
    query fileById($id: ID!) {
  file(id: $id) {
    ...file
    parentsRecursive {
      ...file
    }
  }
}
    ${FileFragmentDoc}`;

export function useFileByIdQuery(options: Omit<Urql.UseQueryArgs<never, FileByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<FileByIdQuery, FileByIdQueryVariables>({ query: FileByIdDocument, ...options });
};
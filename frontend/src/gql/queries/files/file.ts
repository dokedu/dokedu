import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { FileFragmentDoc } from '../../fragments/file';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FileQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type FileQuery = { __typename?: 'Query', file: { __typename?: 'File', id: string, name: string, mime: string, size: number, type: Types.FileType, createdAt: never, deletedAt?: never | null } };


export const FileDocument = gql`
    query file($id: ID!) {
  file(id: $id) {
    ...file
  }
}
    ${FileFragmentDoc}`;

export function useFileQuery(options: Omit<Urql.UseQueryArgs<never, FileQueryVariables>, 'query'>) {
  return Urql.useQuery<FileQuery, FileQueryVariables>({ query: FileDocument, ...options });
};
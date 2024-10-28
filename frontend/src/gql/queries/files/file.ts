import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FileQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type FileQuery = { __typename?: 'Query', file: { __typename?: 'File', id: string, name: string, fileType: Types.FileType, MIMEType: string, size: number, createdAt: never } };


export const FileDocument = gql`
    query file($id: ID!) {
  file(id: $id) {
    id
    name
    fileType
    MIMEType
    size
    createdAt
  }
}
    `;

export function useFileQuery(options?: Omit<Urql.UseQueryArgs<never, FileQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<FileQuery, FileQueryVariables | undefined>({ query: FileDocument, variables: undefined, ...options });
};
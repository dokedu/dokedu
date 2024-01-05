import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FileQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type FileQuery = (
  { __typename?: 'Query' }
  & { file: (
    { __typename?: 'File' }
    & Pick<Types.File, 'id' | 'name' | 'fileType' | 'MIMEType' | 'size' | 'createdAt'>
  ) }
);


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

export function useFileQuery(options: Omit<Urql.UseQueryArgs<never, FileQueryVariables>, 'query'>) {
  return Urql.useQuery<FileQuery, FileQueryVariables>({ query: FileDocument, ...options });
};
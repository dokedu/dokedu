import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FilesQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  filter?: Types.InputMaybe<Types.FilesFilterInput>;
}>;


export type FilesQuery = { __typename?: 'Query', files: { __typename?: 'FileConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'File', id: string, name: string, fileType: Types.FileType, MIMEType: string, size: number, createdAt: never }> } };


export const FilesDocument = gql`
    query files($offset: Int, $limit: Int, $filter: FilesFilterInput) {
  files(input: $filter, limit: $limit, offset: $offset) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      id
      name
      fileType
      MIMEType
      size
      createdAt
    }
  }
}
    `;

export function useFilesQuery(options?: Omit<Urql.UseQueryArgs<never, FilesQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<FilesQuery, FilesQueryVariables | undefined>({ query: FilesDocument, variables: undefined, ...options });
};
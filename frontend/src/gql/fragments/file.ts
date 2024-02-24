import type * as Types from '../schema';

import gql from 'graphql-tag';
export type FileFragment = { __typename?: 'File', id: string, name: string, mime: string, size: number, type: Types.FileType, createdAt: never, deletedAt?: never | null };

export const FileFragmentDoc = gql`
    fragment file on File {
  id
  name
  mime
  size
  type
  createdAt
  deletedAt
}
    `;
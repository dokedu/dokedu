import type * as Types from '../schema';

import gql from 'graphql-tag';
export type FileFragment = { __typename?: 'File', id: string, name: string, fileType: Types.FileType };

export const FileFragmentDoc = gql`
    fragment File on File {
  id
  name
  fileType
}
    `;
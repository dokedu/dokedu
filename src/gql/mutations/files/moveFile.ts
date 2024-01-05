import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type MoveFileMutationVariables = Types.Exact<{
  input: Types.MoveFileInput
}>

export type MoveFileMutation = { __typename?: "Mutation" } & {
  moveFile: { __typename?: "File" } & Pick<Types.File, "id"> & {
      parent?: Types.Maybe<{ __typename?: "File" } & Pick<Types.File, "id">>
    }
}

export const MoveFileDocument = gql`
  mutation moveFile($input: MoveFileInput!) {
    moveFile(input: $input) {
      id
      parent {
        id
      }
    }
  }
`

export function useMoveFileMutation() {
  return Urql.useMutation<MoveFileMutation, MoveFileMutationVariables>(MoveFileDocument)
}

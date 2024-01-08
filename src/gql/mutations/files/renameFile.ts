import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type RenameFileMutationVariables = Types.Exact<{
  input: Types.RenameFileInput
}>

export type RenameFileMutation = {
  __typename?: "Mutation"
  renameFile: { __typename?: "File"; id: string; name: string }
}

export const RenameFileDocument = gql`
  mutation renameFile($input: RenameFileInput!) {
    renameFile(input: $input) {
      id
      name
    }
  }
`

export function useRenameFileMutation() {
  return Urql.useMutation<RenameFileMutation, RenameFileMutationVariables>(RenameFileDocument)
}

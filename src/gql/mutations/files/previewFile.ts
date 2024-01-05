import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type PreviewFileMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type PreviewFileMutation = { __typename?: "Mutation" } & {
  previewFile: { __typename?: "PreviewFilePayload" } & Pick<Types.PreviewFilePayload, "url">
}

export const PreviewFileDocument = gql`
  mutation previewFile($id: ID!) {
    previewFile(input: { id: $id }) {
      url
    }
  }
`

export function usePreviewFileMutation() {
  return Urql.useMutation<PreviewFileMutation, PreviewFileMutationVariables>(PreviewFileDocument)
}

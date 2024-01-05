import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type ArchiveTagMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type ArchiveTagMutation = { __typename?: "Mutation" } & {
  archiveTag: { __typename?: "Tag" } & Pick<Types.Tag, "id" | "name" | "color" | "deletedAt" | "createdAt">
}

export const ArchiveTagDocument = gql`
  mutation archiveTag($id: ID!) {
    archiveTag(id: $id) {
      id
      name
      color
      deletedAt
      createdAt
    }
  }
`

export function useArchiveTagMutation() {
  return Urql.useMutation<ArchiveTagMutation, ArchiveTagMutationVariables>(ArchiveTagDocument)
}

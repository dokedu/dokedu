import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type ArchiveEntryMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type ArchiveEntryMutation = { __typename?: "Mutation"; archiveEntry: { __typename?: "Entry"; id: string } }

export const ArchiveEntryDocument = gql`
  mutation archiveEntry($id: ID!) {
    archiveEntry(id: $id) {
      id
    }
  }
`

export function useArchiveEntryMutation() {
  return Urql.useMutation<ArchiveEntryMutation, ArchiveEntryMutationVariables>(ArchiveEntryDocument)
}

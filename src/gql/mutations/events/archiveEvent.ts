import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type ArchiveEventMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type ArchiveEventMutation = { __typename?: "Mutation" } & {
  archiveEvent: { __typename?: "Event" } & Pick<Types.Event, "id">
}

export const ArchiveEventDocument = gql`
  mutation archiveEvent($id: ID!) {
    archiveEvent(id: $id) {
      id
    }
  }
`

export function useArchiveEventMutation() {
  return Urql.useMutation<ArchiveEventMutation, ArchiveEventMutationVariables>(ArchiveEventDocument)
}

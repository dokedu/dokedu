import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type ArchiveUserMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type ArchiveUserMutation = { __typename?: "Mutation" } & {
  archiveUser: { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName" | "email" | "role">
}

export const ArchiveUserDocument = gql`
  mutation archiveUser($id: ID!) {
    archiveUser(id: $id) {
      id
      firstName
      lastName
      email
      role
    }
  }
`

export function useArchiveUserMutation() {
  return Urql.useMutation<ArchiveUserMutation, ArchiveUserMutationVariables>(ArchiveUserDocument)
}

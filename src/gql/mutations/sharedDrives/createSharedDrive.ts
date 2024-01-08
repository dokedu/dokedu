import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type CreateSharedDriveMutationVariables = Types.Exact<{
  name: Types.Scalars["String"]["input"]
}>

export type CreateSharedDriveMutation = {
  __typename?: "Mutation"
  createSharedDrive: { __typename?: "Bucket"; id: string; name: string }
}

export const CreateSharedDriveDocument = gql`
  mutation createSharedDrive($name: String!) {
    createSharedDrive(name: $name) {
      id
      name
    }
  }
`

export function useCreateSharedDriveMutation() {
  return Urql.useMutation<CreateSharedDriveMutation, CreateSharedDriveMutationVariables>(CreateSharedDriveDocument)
}

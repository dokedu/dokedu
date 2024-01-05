import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type UpdateEventMutationVariables = Types.Exact<{
  input: Types.UpdateEventInput
}>

export type UpdateEventMutation = { __typename?: "Mutation" } & {
  updateEvent: { __typename?: "Event" } & Pick<
    Types.Event,
    "id" | "title" | "body" | "startsAt" | "endsAt" | "recurrence" | "createdAt"
  > & { image?: Types.Maybe<{ __typename?: "File" } & Pick<Types.File, "id">> }
}

export const UpdateEventDocument = gql`
  mutation updateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      id
      title
      image {
        id
      }
      body
      startsAt
      endsAt
      recurrence
      createdAt
    }
  }
`

export function useUpdateEventMutation() {
  return Urql.useMutation<UpdateEventMutation, UpdateEventMutationVariables>(UpdateEventDocument)
}

import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type CreateEventMutationVariables = Types.Exact<{
  input: Types.CreateEventInput
}>

export type CreateEventMutation = { __typename?: "Mutation" } & {
  createEvent: { __typename?: "Event" } & Pick<
    Types.Event,
    "id" | "title" | "body" | "startsAt" | "endsAt" | "recurrence" | "createdAt"
  > & { image?: Types.Maybe<{ __typename?: "File" } & Pick<Types.File, "id">> }
}

export const CreateEventDocument = gql`
  mutation createEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
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

export function useCreateEventMutation() {
  return Urql.useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument)
}

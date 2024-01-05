import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type EventQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type EventQuery = { __typename?: "Query" } & {
  event: { __typename?: "Event" } & Pick<Types.Event, "id" | "title" | "body" | "createdAt" | "startsAt" | "endsAt"> & {
      competences: Array<
        { __typename?: "Competence" } & Pick<Types.Competence, "id" | "name" | "type" | "grades"> & {
            parents: Array<
              { __typename?: "Competence" } & Pick<Types.Competence, "id" | "name" | "type" | "grades" | "color">
            >
          }
      >
    }
}

export const EventDocument = gql`
  query event($id: ID!) {
    event(id: $id) {
      id
      title
      body
      createdAt
      startsAt
      endsAt
      competences {
        id
        name
        type
        grades
        parents {
          id
          name
          type
          grades
          color
        }
      }
    }
  }
`

export function useEventQuery(options: Omit<Urql.UseQueryArgs<never, EventQueryVariables>, "query">) {
  return Urql.useQuery<EventQuery, EventQueryVariables>({ query: EventDocument, ...options })
}

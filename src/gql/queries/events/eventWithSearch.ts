import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type EventWithSearchQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars["String"]["input"]>
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>
  order?: Types.InputMaybe<Types.EventOrderBy>
  filter?: Types.InputMaybe<Types.EventFilterInput>
}>

export type EventWithSearchQuery = { __typename?: "Query" } & {
  events: { __typename?: "EventConnection" } & {
    pageInfo: { __typename?: "PageInfo" } & Pick<Types.PageInfo, "hasNextPage" | "hasPreviousPage">
    edges?: Types.Maybe<
      Array<
        Types.Maybe<
          { __typename?: "Event" } & Pick<Types.Event, "id" | "title" | "body" | "createdAt" | "startsAt" | "endsAt">
        >
      >
    >
  }
}

export const EventWithSearchDocument = gql`
  query eventWithSearch($search: String, $offset: Int, $order: EventOrderBy, $filter: EventFilterInput) {
    events(search: $search, limit: 50, offset: $offset, order: $order, filter: $filter) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        id
        title
        body
        createdAt
        startsAt
        endsAt
      }
    }
  }
`

export function useEventWithSearchQuery(
  options: Omit<Urql.UseQueryArgs<never, EventWithSearchQueryVariables>, "query">
) {
  return Urql.useQuery<EventWithSearchQuery, EventWithSearchQueryVariables>({
    query: EventWithSearchDocument,
    ...options
  })
}

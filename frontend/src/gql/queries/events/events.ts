import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EventsQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type EventsQuery = { __typename?: 'Query', events: { __typename?: 'EventConnection', edges?: Array<{ __typename?: 'Event', id: string, title: string } | null> | null } };


export const EventsDocument = gql`
    query events($search: String) {
  events(limit: 100, search: $search) {
    edges {
      id
      title
    }
  }
}
    `;

export function useEventsQuery(options?: Omit<Urql.UseQueryArgs<never, EventsQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<EventsQuery, EventsQueryVariables | undefined>({ query: EventsDocument, variables: undefined, ...options });
};
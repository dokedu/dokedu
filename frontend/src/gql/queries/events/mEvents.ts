import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type MEventsQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type MEventsQuery = { __typename?: 'Query', events: { __typename?: 'EventConnection', edges?: Array<{ __typename?: 'Event', id: string, title: string } | null> | null } };


export const MEventsDocument = gql`
    query mEvents($search: String) {
  events(search: $search, limit: 100) {
    edges {
      id
      title
    }
  }
}
    `;

export function useMEventsQuery(options: Omit<Urql.UseQueryArgs<never, MEventsQueryVariables>, 'query'>) {
  return Urql.useQuery<MEventsQuery, MEventsQueryVariables>({ query: MEventsDocument, ...options });
};
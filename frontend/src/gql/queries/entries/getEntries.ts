import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetEntriesQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.EntryFilterInput>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  order?: Types.InputMaybe<Types.EntrySortBy>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetEntriesQuery = { __typename?: 'Query', entries: { __typename?: 'EntryConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'Entry', id: string, date: string, body?: string | null, createdAt: never, user: { __typename?: 'User', id: string, firstName: string, lastName: string }, events: Array<{ __typename?: 'Event', id: string, title: string }>, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: string }>, subjects: Array<{ __typename?: 'Competence', id: string, name: string, color: string }> }> } };


export const GetEntriesDocument = gql`
    query getEntries($filter: EntryFilterInput, $limit: Int, $order: EntrySortBy, $offset: Int) {
  entries(filter: $filter, limit: $limit, sortBy: $order, offset: $offset) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      id
      date
      body
      user {
        id
        firstName
        lastName
      }
      createdAt
      events {
        id
        title
      }
      tags {
        id
        name
        color
      }
      subjects {
        id
        name
        color
      }
    }
  }
}
    `;

export function useGetEntriesQuery(options: Omit<Urql.UseQueryArgs<never, GetEntriesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetEntriesQuery, GetEntriesQueryVariables>({ query: GetEntriesDocument, ...options });
};
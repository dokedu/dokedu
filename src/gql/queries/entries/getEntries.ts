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


export type GetEntriesQuery = (
  { __typename?: 'Query' }
  & { entries: (
    { __typename?: 'EntryConnection' }
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage'>
    ), edges: Array<(
      { __typename?: 'Entry' }
      & Pick<Types.Entry, 'id' | 'date' | 'body' | 'createdAt'>
      & { user: (
        { __typename?: 'User' }
        & Pick<Types.User, 'id' | 'firstName' | 'lastName'>
      ), events: Array<(
        { __typename?: 'Event' }
        & Pick<Types.Event, 'id' | 'title'>
      )>, tags: Array<(
        { __typename?: 'Tag' }
        & Pick<Types.Tag, 'id' | 'name' | 'color'>
      )>, subjects: Array<(
        { __typename?: 'Competence' }
        & Pick<Types.Competence, 'id' | 'name' | 'color'>
      )> }
    )> }
  ) }
);


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
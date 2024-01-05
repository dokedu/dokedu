import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ReportsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ReportsQuery = (
  { __typename?: 'Query' }
  & { reports: (
    { __typename?: 'ReportConnection' }
    & Pick<Types.ReportConnection, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage'>
    ), edges?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'Report' }
      & Pick<Types.Report, 'id' | 'status' | 'format' | 'kind' | 'from' | 'to' | 'createdAt'>
      & { studentUser: (
        { __typename?: 'User' }
        & Pick<Types.User, 'id' | 'firstName' | 'lastName'>
      ), user: (
        { __typename?: 'User' }
        & Pick<Types.User, 'id' | 'firstName' | 'lastName'>
      ), file?: Types.Maybe<(
        { __typename?: 'File' }
        & Pick<Types.File, 'id'>
      )> }
    )>>> }
  ) }
);


export const ReportsDocument = gql`
    query reports {
  reports(limit: 30) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      id
      status
      format
      kind
      from
      to
      createdAt
      studentUser {
        id
        firstName
        lastName
      }
      user {
        id
        firstName
        lastName
      }
      file {
        id
      }
    }
  }
}
    `;

export function useReportsQuery(options: Omit<Urql.UseQueryArgs<never, ReportsQueryVariables>, 'query'>) {
  return Urql.useQuery<ReportsQuery, ReportsQueryVariables>({ query: ReportsDocument, ...options });
};
import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ReportsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ReportsQuery = { __typename?: 'Query', reports: { __typename?: 'ReportConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean }, edges?: Array<{ __typename?: 'Report', id: string, status: Types.ReportStatus, format: Types.ReportFormat, kind: Types.ReportKind, from: never, to: never, createdAt: never, studentUser: { __typename?: 'User', id: string, firstName: string, lastName: string }, user: { __typename?: 'User', id: string, firstName: string, lastName: string }, file?: { __typename?: 'File', id: string } | null } | null> | null } };


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
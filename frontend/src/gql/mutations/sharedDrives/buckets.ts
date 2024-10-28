import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type BucketsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type BucketsQuery = { __typename?: 'Query', buckets: { __typename?: 'BucketConnection', totalCount: number, edges: Array<{ __typename?: 'Bucket', id: string, name: string, shared: boolean, createdAt: never, permission?: Types.FilePermission | null }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };


export const BucketsDocument = gql`
    query buckets {
  buckets(input: {shared: true}) {
    edges {
      id
      name
      shared
      createdAt
      permission
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useBucketsQuery(options?: Omit<Urql.UseQueryArgs<never, BucketsQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<BucketsQuery, BucketsQueryVariables | undefined>({ query: BucketsDocument, variables: undefined, ...options });
};
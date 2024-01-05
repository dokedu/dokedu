import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type BucketsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type BucketsQuery = (
  { __typename?: 'Query' }
  & { buckets: (
    { __typename?: 'BucketConnection' }
    & Pick<Types.BucketConnection, 'totalCount'>
    & { edges: Array<(
      { __typename?: 'Bucket' }
      & Pick<Types.Bucket, 'id' | 'name' | 'shared' | 'createdAt' | 'permission'>
    )>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage'>
    ) }
  ) }
);


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

export function useBucketsQuery(options: Omit<Urql.UseQueryArgs<never, BucketsQueryVariables>, 'query'>) {
  return Urql.useQuery<BucketsQuery, BucketsQueryVariables>({ query: BucketsDocument, ...options });
};
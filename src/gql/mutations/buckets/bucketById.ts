import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type BucketByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type BucketByIdQuery = { __typename?: 'Query', bucket: { __typename?: 'Bucket', id: string, name: string } };


export const BucketByIdDocument = gql`
    query bucketById($id: ID!) {
  bucket(id: $id) {
    id
    name
  }
}
    `;

export function useBucketByIdQuery(options: Omit<Urql.UseQueryArgs<never, BucketByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<BucketByIdQuery, BucketByIdQueryVariables>({ query: BucketByIdDocument, ...options });
};
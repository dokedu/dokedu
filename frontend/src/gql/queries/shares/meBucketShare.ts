import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type MeBucketShareQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MeBucketShareQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string } };


export const MeBucketShareDocument = gql`
    query meBucketShare {
  me {
    id
  }
}
    `;

export function useMeBucketShareQuery(options?: Omit<Urql.UseQueryArgs<never, MeBucketShareQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<MeBucketShareQuery, MeBucketShareQueryVariables | undefined>({ query: MeBucketShareDocument, variables: undefined, ...options });
};
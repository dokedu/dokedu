import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type BucketSharesQueryVariables = Types.Exact<{
  input: Types.ShareInput;
}>;


export type BucketSharesQuery = (
  { __typename?: 'Query' }
  & { shares?: Types.Maybe<Array<(
    { __typename?: 'ShareUser' }
    & Pick<Types.ShareUser, 'permission'>
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstName' | 'lastName'>
    ) }
  )>> }
);


export const BucketSharesDocument = gql`
    query bucketShares($input: ShareInput!) {
  shares(input: $input) {
    user {
      id
      firstName
      lastName
    }
    permission
  }
}
    `;

export function useBucketSharesQuery(options: Omit<Urql.UseQueryArgs<never, BucketSharesQueryVariables>, 'query'>) {
  return Urql.useQuery<BucketSharesQuery, BucketSharesQueryVariables>({ query: BucketSharesDocument, ...options });
};
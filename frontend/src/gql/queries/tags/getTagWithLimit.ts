import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetTagWithLimitQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetTagWithLimitQuery = { __typename?: 'Query', tags: { __typename?: 'TagConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean }, edges?: Array<{ __typename?: 'Tag', id: string, name: string, color: string, deletedAt?: never | null, createdAt: never } | null> | null } };


export const GetTagWithLimitDocument = gql`
    query getTagWithLimit($limit: Int, $offset: Int) {
  tags(limit: $limit, offset: $offset) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      id
      name
      color
      deletedAt
      createdAt
    }
  }
}
    `;

export function useGetTagWithLimitQuery(options: Omit<Urql.UseQueryArgs<never, GetTagWithLimitQueryVariables>, 'query'>) {
  return Urql.useQuery<GetTagWithLimitQuery, GetTagWithLimitQueryVariables>({ query: GetTagWithLimitDocument, ...options });
};
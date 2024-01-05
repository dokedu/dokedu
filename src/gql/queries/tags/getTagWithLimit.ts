import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetTagWithLimitQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetTagWithLimitQuery = (
  { __typename?: 'Query' }
  & { tags: (
    { __typename?: 'TagConnection' }
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage'>
    ), edges?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'Tag' }
      & Pick<Types.Tag, 'id' | 'name' | 'color' | 'deletedAt' | 'createdAt'>
    )>>> }
  ) }
);


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
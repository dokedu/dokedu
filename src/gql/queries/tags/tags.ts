import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type TagLimitedQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type TagLimitedQuery = (
  { __typename?: 'Query' }
  & { tags: (
    { __typename?: 'TagConnection' }
    & { edges?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'Tag' }
      & Pick<Types.Tag, 'id' | 'name' | 'color'>
    )>>> }
  ) }
);


export const TagLimitedDocument = gql`
    query tagLimited($search: String) {
  tags(limit: 100, search: $search) {
    edges {
      id
      name
      color
    }
  }
}
    `;

export function useTagLimitedQuery(options: Omit<Urql.UseQueryArgs<never, TagLimitedQueryVariables>, 'query'>) {
  return Urql.useQuery<TagLimitedQuery, TagLimitedQueryVariables>({ query: TagLimitedDocument, ...options });
};
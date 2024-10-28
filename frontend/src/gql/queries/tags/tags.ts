import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type TagLimitedQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type TagLimitedQuery = { __typename?: 'Query', tags: { __typename?: 'TagConnection', edges?: Array<{ __typename?: 'Tag', id: string, name: string, color: string } | null> | null } };


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

export function useTagLimitedQuery(options?: Omit<Urql.UseQueryArgs<never, TagLimitedQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<TagLimitedQuery, TagLimitedQueryVariables | undefined>({ query: TagLimitedDocument, variables: undefined, ...options });
};
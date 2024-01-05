import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type GetTagsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetTagsQuery = { __typename?: "Query" } & {
  tags: { __typename?: "TagConnection" } & {
    edges?: Types.Maybe<
      Array<Types.Maybe<{ __typename?: "Tag" } & Pick<Types.Tag, "id" | "name" | "color" | "deletedAt" | "createdAt">>>
    >
  }
}

export const GetTagsDocument = gql`
  query getTags {
    tags(limit: 1000) {
      edges {
        id
        name
        color
        deletedAt
        createdAt
      }
    }
  }
`

export function useGetTagsQuery(options: Omit<Urql.UseQueryArgs<never, GetTagsQueryVariables>, "query">) {
  return Urql.useQuery<GetTagsQuery, GetTagsQueryVariables>({ query: GetTagsDocument, ...options })
}

import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type BucketByIdSharedQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type BucketByIdSharedQuery = {
  __typename?: "Query"
  bucket: { __typename?: "Bucket"; id: string; permission?: Types.FilePermission | null }
}

export const BucketByIdSharedDocument = gql`
  query bucketByIdShared($id: ID!) {
    bucket(id: $id) {
      id
      permission
    }
  }
`

export function useBucketByIdSharedQuery(
  options: Omit<Urql.UseQueryArgs<never, BucketByIdSharedQueryVariables>, "query">
) {
  return Urql.useQuery<BucketByIdSharedQuery, BucketByIdSharedQueryVariables>({
    query: BucketByIdSharedDocument,
    ...options
  })
}

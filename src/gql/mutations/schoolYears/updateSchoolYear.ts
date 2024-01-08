import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type UpdateSchoolYearMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
  year: Types.Scalars["Int"]["input"]
}>

export type UpdateSchoolYearMutation = {
  __typename?: "Mutation"
  updateSchoolYear: { __typename?: "SchoolYear"; id: string; year: number; description: string }
}

export const UpdateSchoolYearDocument = gql`
  mutation updateSchoolYear($id: ID!, $year: Int!) {
    updateSchoolYear(input: { id: $id, year: $year }) {
      id
      year
      description
    }
  }
`

export function useUpdateSchoolYearMutation() {
  return Urql.useMutation<UpdateSchoolYearMutation, UpdateSchoolYearMutationVariables>(UpdateSchoolYearDocument)
}

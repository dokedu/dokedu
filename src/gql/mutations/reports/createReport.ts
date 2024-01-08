import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type CreateReportMutationVariables = Types.Exact<{
  input: Types.CreateReportInput
}>

export type CreateReportMutation = { __typename?: "Mutation"; createReport: { __typename?: "Report"; id: string } }

export const CreateReportDocument = gql`
  mutation createReport($input: CreateReportInput!) {
    createReport(input: $input) {
      id
    }
  }
`

export function useCreateReportMutation() {
  return Urql.useMutation<CreateReportMutation, CreateReportMutationVariables>(CreateReportDocument)
}

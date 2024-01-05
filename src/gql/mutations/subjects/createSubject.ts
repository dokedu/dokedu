import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type CreateSubjectMutationVariables = Types.Exact<{
  name: Types.Scalars["String"]["input"]
}>

export type CreateSubjectMutation = { __typename?: "Mutation" } & {
  createSubject: { __typename?: "Subject" } & Pick<Types.Subject, "id" | "name">
}

export const CreateSubjectDocument = gql`
  mutation createSubject($name: String!) {
    createSubject(input: { name: $name }) {
      id
      name
    }
  }
`

export function useCreateSubjectMutation() {
  return Urql.useMutation<CreateSubjectMutation, CreateSubjectMutationVariables>(CreateSubjectDocument)
}

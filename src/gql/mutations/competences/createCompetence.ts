import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type CreateCompetenceMutationVariables = Types.Exact<{
  input: Types.CreateCompetenceInput
}>

export type CreateCompetenceMutation = { __typename?: "Mutation" } & {
  createCompetence: { __typename?: "Competence" } & Pick<
    Types.Competence,
    "id" | "name" | "type" | "grades" | "color"
  > & {
      parents: Array<
        { __typename?: "Competence" } & Pick<Types.Competence, "id" | "name" | "type" | "grades" | "color">
      >
    }
}

export const CreateCompetenceDocument = gql`
  mutation createCompetence($input: CreateCompetenceInput!) {
    createCompetence(input: $input) {
      id
      name
      type
      grades
      color
      parents {
        id
        name
        type
        grades
        color
      }
    }
  }
`

export function useCreateCompetenceMutation() {
  return Urql.useMutation<CreateCompetenceMutation, CreateCompetenceMutationVariables>(CreateCompetenceDocument)
}

import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type CreateDomainMutationVariables = Types.Exact<{
  input: Types.CreateDomainInput
}>

export type CreateDomainMutation = { __typename?: "Mutation" } & {
  createDomain?: Types.Maybe<{ __typename?: "Domain" } & Pick<Types.Domain, "id" | "name" | "createdAt">>
}

export const CreateDomainDocument = gql`
  mutation createDomain($input: CreateDomainInput!) {
    createDomain(input: $input) {
      id
      name
      createdAt
    }
  }
`

export function useCreateDomainMutation() {
  return Urql.useMutation<CreateDomainMutation, CreateDomainMutationVariables>(CreateDomainDocument)
}

import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateUserCompetenceMutationVariables = Types.Exact<{
  input: Types.CreateUserCompetenceInput;
}>;


export type CreateUserCompetenceMutation = (
  { __typename?: 'Mutation' }
  & { createUserCompetence: (
    { __typename?: 'UserCompetence' }
    & Pick<Types.UserCompetence, 'id' | 'level'>
  ) }
);


export const CreateUserCompetenceDocument = gql`
    mutation createUserCompetence($input: CreateUserCompetenceInput!) {
  createUserCompetence(input: $input) {
    id
    level
  }
}
    `;

export function useCreateUserCompetenceMutation() {
  return Urql.useMutation<CreateUserCompetenceMutation, CreateUserCompetenceMutationVariables>(CreateUserCompetenceDocument);
};
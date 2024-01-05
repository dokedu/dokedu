import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateOrganisationMutationVariables = Types.Exact<{
  input: Types.UpdateOrganisationInput;
}>;


export type UpdateOrganisationMutation = (
  { __typename?: 'Mutation' }
  & { updateOrganisation: (
    { __typename?: 'Organisation' }
    & Pick<Types.Organisation, 'id' | 'name' | 'legalName'>
  ) }
);


export const UpdateOrganisationDocument = gql`
    mutation updateOrganisation($input: UpdateOrganisationInput!) {
  updateOrganisation(input: $input) {
    id
    name
    legalName
  }
}
    `;

export function useUpdateOrganisationMutation() {
  return Urql.useMutation<UpdateOrganisationMutation, UpdateOrganisationMutationVariables>(UpdateOrganisationDocument);
};
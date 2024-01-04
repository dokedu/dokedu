import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateSubjectMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  name: Types.Scalars['String']['input'];
}>;


export type UpdateSubjectMutation = (
  { __typename?: 'Mutation' }
  & { updateSubject: (
    { __typename?: 'Subject' }
    & Pick<Types.Subject, 'id' | 'name'>
  ) }
);


export const UpdateSubjectDocument = gql`
    mutation updateSubject($id: ID!, $name: String!) {
  updateSubject(input: {id: $id, name: $name}) {
    id
    name
  }
}
    `;

export function useUpdateSubjectMutation() {
  return Urql.useMutation<UpdateSubjectMutation, UpdateSubjectMutationVariables>(UpdateSubjectDocument);
};
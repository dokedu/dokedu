import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateUserStudentGradeMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  grade: Types.Scalars['Int']['input'];
}>;


export type UpdateUserStudentGradeMutation = (
  { __typename?: 'Mutation' }
  & { updateUserStudentGrade: (
    { __typename?: 'UserStudentGrades' }
    & Pick<Types.UserStudentGrades, 'id' | 'grade'>
  ) }
);


export const UpdateUserStudentGradeDocument = gql`
    mutation updateUserStudentGrade($id: ID!, $grade: Int!) {
  updateUserStudentGrade(input: {id: $id, grade: $grade}) {
    id
    grade
  }
}
    `;

export function useUpdateUserStudentGradeMutation() {
  return Urql.useMutation<UpdateUserStudentGradeMutation, UpdateUserStudentGradeMutationVariables>(UpdateUserStudentGradeDocument);
};
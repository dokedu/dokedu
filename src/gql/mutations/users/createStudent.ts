import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateStudentMutationVariables = Types.Exact<{
  student: Types.CreateStudentInput;
}>;


export type CreateStudentMutation = (
  { __typename?: 'Mutation' }
  & { createStudent: (
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'firstName' | 'lastName'>
    & { student?: Types.Maybe<(
      { __typename?: 'UserStudent' }
      & Pick<Types.UserStudent, 'id' | 'birthday' | 'grade' | 'leftAt' | 'joinedAt'>
    )> }
  ) }
);


export const CreateStudentDocument = gql`
    mutation createStudent($student: CreateStudentInput!) {
  createStudent(input: $student) {
    id
    firstName
    lastName
    student {
      id
      birthday
      grade
      leftAt
      joinedAt
    }
  }
}
    `;

export function useCreateStudentMutation() {
  return Urql.useMutation<CreateStudentMutation, CreateStudentMutationVariables>(CreateStudentDocument);
};
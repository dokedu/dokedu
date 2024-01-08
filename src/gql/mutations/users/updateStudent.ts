import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateStudentMutationVariables = Types.Exact<{
  student: Types.UpdateUserInput;
}>;


export type UpdateStudentMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, firstName: string, lastName: string, role: Types.UserRole, student?: { __typename?: 'UserStudent', id: string, birthday?: never | null, grade: number, leftAt?: never | null, joinedAt?: never | null, emoji?: string | null } | null } };


export const UpdateStudentDocument = gql`
    mutation updateStudent($student: UpdateUserInput!) {
  updateUser(input: $student) {
    id
    firstName
    lastName
    role
    student {
      id
      birthday
      grade
      leftAt
      joinedAt
      emoji
    }
  }
}
    `;

export function useUpdateStudentMutation() {
  return Urql.useMutation<UpdateStudentMutation, UpdateStudentMutationVariables>(UpdateStudentDocument);
};
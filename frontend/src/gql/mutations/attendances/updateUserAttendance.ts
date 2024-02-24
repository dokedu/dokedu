import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateUserAttendanceMutationVariables = Types.Exact<{
  input: Types.UpdateUserAttendanceInput;
}>;


export type UpdateUserAttendanceMutation = { __typename?: 'Mutation', updateUserAttendance: { __typename?: 'UserAttendance', id: string, date: never, state: Types.UserAttendanceState, user: { __typename?: 'User', id: string, firstName: string, lastName: string } } };


export const UpdateUserAttendanceDocument = gql`
    mutation updateUserAttendance($input: UpdateUserAttendanceInput!) {
  updateUserAttendance(input: $input) {
    id
    date
    state
    user {
      id
      firstName
      lastName
    }
  }
}
    `;

export function useUpdateUserAttendanceMutation() {
  return Urql.useMutation<UpdateUserAttendanceMutation, UpdateUserAttendanceMutationVariables>(UpdateUserAttendanceDocument);
};
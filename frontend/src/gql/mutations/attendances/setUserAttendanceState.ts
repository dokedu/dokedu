import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SetUserAttendanceStateMutationVariables = Types.Exact<{
  state: Types.UserAttendanceState;
  date: Types.Scalars['Time']['input'];
  userId: Types.Scalars['ID']['input'];
}>;


export type SetUserAttendanceStateMutation = { __typename?: 'Mutation', setUserAttendanceState: { __typename?: 'UserAttendance', id: string, date: never, state: Types.UserAttendanceState, user: { __typename?: 'User', id: string, firstName: string, lastName: string } } };


export const SetUserAttendanceStateDocument = gql`
    mutation setUserAttendanceState($state: UserAttendanceState!, $date: Time!, $userId: ID!) {
  setUserAttendanceState(state: $state, date: $date, userId: $userId) {
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

export function useSetUserAttendanceStateMutation() {
  return Urql.useMutation<SetUserAttendanceStateMutation, SetUserAttendanceStateMutationVariables>(SetUserAttendanceStateDocument);
};
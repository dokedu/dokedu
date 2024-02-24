import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { UserFragmentDoc } from '../../fragments/user';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UserAttendanceOverviewQueryVariables = Types.Exact<{
  date: Types.Scalars['Time']['input'];
}>;


export type UserAttendanceOverviewQuery = { __typename?: 'Query', userAttendances: Array<{ __typename?: 'UserAttendance', id: string, date: never, state: Types.UserAttendanceState, user: { __typename?: 'User', id: string, role: Types.UserRole, email?: string | null, firstName: string, lastName: string, organisationId: string, language?: Types.UserLanguage | null } }> };


export const UserAttendanceOverviewDocument = gql`
    query userAttendanceOverview($date: Time!) {
  userAttendances(date: $date) {
    id
    date
    user {
      ...user
    }
    state
  }
}
    ${UserFragmentDoc}`;

export function useUserAttendanceOverviewQuery(options: Omit<Urql.UseQueryArgs<never, UserAttendanceOverviewQueryVariables>, 'query'>) {
  return Urql.useQuery<UserAttendanceOverviewQuery, UserAttendanceOverviewQueryVariables>({ query: UserAttendanceOverviewDocument, ...options });
};
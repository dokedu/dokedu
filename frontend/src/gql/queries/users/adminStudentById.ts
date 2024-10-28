import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AdminStudentByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type AdminStudentByIdQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, firstName: string, lastName: string, role: Types.UserRole, student?: { __typename?: 'UserStudent', id: string, grade: number, birthday?: never | null, joinedAt?: never | null, leftAt?: never | null, emoji?: string | null, missedHours: number, missedHoursExcused: number } | null } };


export const AdminStudentByIdDocument = gql`
    query adminStudentById($id: ID!) {
  user(id: $id) {
    id
    firstName
    lastName
    role
    student {
      id
      grade
      birthday
      joinedAt
      leftAt
      emoji
      missedHours
      missedHoursExcused
    }
  }
}
    `;

export function useAdminStudentByIdQuery(options?: Omit<Urql.UseQueryArgs<never, AdminStudentByIdQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<AdminStudentByIdQuery, AdminStudentByIdQueryVariables | undefined>({ query: AdminStudentByIdDocument, variables: undefined, ...options });
};
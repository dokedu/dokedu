import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ArchiveStudentMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ArchiveStudentMutation = { __typename?: 'Mutation', archiveUser: { __typename?: 'User', id: string, firstName: string, lastName: string, role: Types.UserRole, student?: { __typename?: 'UserStudent', birthday?: never | null, grade: number, leftAt?: never | null, joinedAt?: never | null } | null } };


export const ArchiveStudentDocument = gql`
    mutation archiveStudent($id: ID!) {
  archiveUser(id: $id) {
    id
    firstName
    lastName
    role
    student {
      birthday
      grade
      leftAt
      joinedAt
    }
  }
}
    `;

export function useArchiveStudentMutation() {
  return Urql.useMutation<ArchiveStudentMutation, ArchiveStudentMutationVariables>(ArchiveStudentDocument);
};
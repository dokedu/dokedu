import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ImportStudentsMutationVariables = Types.Exact<{
  input: Types.ImportStudentsInput;
}>;


export type ImportStudentsMutation = (
  { __typename?: 'Mutation' }
  & { importStudents: (
    { __typename?: 'ImportStudentsPayload' }
    & Pick<Types.ImportStudentsPayload, 'usersCreated' | 'usersExisted' | 'errors'>
  ) }
);


export const ImportStudentsDocument = gql`
    mutation importStudents($input: ImportStudentsInput!) {
  importStudents(input: $input) {
    usersCreated
    usersExisted
    errors
  }
}
    `;

export function useImportStudentsMutation() {
  return Urql.useMutation<ImportStudentsMutation, ImportStudentsMutationVariables>(ImportStudentsDocument);
};
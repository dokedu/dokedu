import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateUserLanguageMutationVariables = Types.Exact<{
  language: Types.UserLanguage;
}>;


export type UpdateUserLanguageMutation = (
  { __typename?: 'Mutation' }
  & { updateUserLanguage: (
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'language'>
  ) }
);


export const UpdateUserLanguageDocument = gql`
    mutation updateUserLanguage($language: UserLanguage!) {
  updateUserLanguage(language: $language) {
    id
    language
  }
}
    `;

export function useUpdateUserLanguageMutation() {
  return Urql.useMutation<UpdateUserLanguageMutation, UpdateUserLanguageMutationVariables>(UpdateUserLanguageDocument);
};
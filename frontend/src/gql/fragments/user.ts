import type * as Types from '../schema';

import gql from 'graphql-tag';
export type UserFragment = { __typename?: 'User', id: string, role: Types.UserRole, email?: string | null, firstName: string, lastName: string, organisationId: string, language?: Types.UserLanguage | null };

export const UserFragmentDoc = gql`
    fragment user on User {
  id
  role
  email
  firstName
  lastName
  organisationId
  language
}
    `;
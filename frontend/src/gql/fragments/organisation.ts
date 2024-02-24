import type * as Types from '../schema';

import gql from 'graphql-tag';
import { UserFragmentDoc } from './user';
export type OrganisationFragment = { __typename?: 'Organisation', id: string, name: string, legalName: string, applications: Array<Types.OrganisationApplication>, phone?: string | null, website?: string | null, owner: { __typename?: 'User', id: string, role: Types.UserRole, email?: string | null, firstName: string, lastName: string, organisationId: string, language?: Types.UserLanguage | null } };

export const OrganisationFragmentDoc = gql`
    fragment organisation on Organisation {
  id
  name
  legalName
  applications
  phone
  website
  owner {
    ...user
  }
}
    ${UserFragmentDoc}`;
import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { OrganisationFragmentDoc } from '../../fragments/organisation';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type OrganisationQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OrganisationQuery = { __typename?: 'Query', organisation?: { __typename?: 'Organisation', id: string, name: string, legalName: string, applications: Array<Types.OrganisationApplication>, phone?: string | null, website?: string | null, owner: { __typename?: 'User', id: string, role: Types.UserRole, email?: string | null, firstName: string, lastName: string, organisationId: string, language?: Types.UserLanguage | null } } | null };


export const OrganisationDocument = gql`
    query organisation {
  organisation {
    ...organisation
  }
}
    ${OrganisationFragmentDoc}`;

export function useOrganisationQuery(options: Omit<Urql.UseQueryArgs<never, OrganisationQueryVariables>, 'query'>) {
  return Urql.useQuery<OrganisationQuery, OrganisationQueryVariables>({ query: OrganisationDocument, ...options });
};
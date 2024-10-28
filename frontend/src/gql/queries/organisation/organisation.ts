import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type OrganisationQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OrganisationQuery = { __typename?: 'Query', organisation?: { __typename?: 'Organisation', id: string, name: string, legalName: string } | null };


export const OrganisationDocument = gql`
    query organisation {
  organisation {
    id
    name
    legalName
  }
}
    `;

export function useOrganisationQuery(options?: Omit<Urql.UseQueryArgs<never, OrganisationQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<OrganisationQuery, OrganisationQueryVariables | undefined>({ query: OrganisationDocument, variables: undefined, ...options });
};
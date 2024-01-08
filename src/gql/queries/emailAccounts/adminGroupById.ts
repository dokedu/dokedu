import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AdminGroupByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type AdminGroupByIdQuery = { __typename?: 'Query', emailAccount?: { __typename?: 'EmailAccount', id: string, name: string, description?: string | null, members?: Array<{ __typename?: 'EmailGroupMember', name: string } | null> | null } | null };


export const AdminGroupByIdDocument = gql`
    query adminGroupById($id: ID!) {
  emailAccount(id: $id) {
    id
    name
    description
    members {
      name
    }
  }
}
    `;

export function useAdminGroupByIdQuery(options: Omit<Urql.UseQueryArgs<never, AdminGroupByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<AdminGroupByIdQuery, AdminGroupByIdQueryVariables>({ query: AdminGroupByIdDocument, ...options });
};
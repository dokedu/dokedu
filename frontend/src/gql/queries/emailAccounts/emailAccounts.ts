import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EmailAccountsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EmailAccountsQuery = { __typename?: 'Query', emailAccounts?: { __typename?: 'EmailAccountConnection', totalCount: number, edges?: Array<{ __typename?: 'EmailAccount', id: string, name: string, description?: string | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };


export const EmailAccountsDocument = gql`
    query emailAccounts {
  emailAccounts(filter: {type: GROUP}) {
    edges {
      id
      name
      description
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useEmailAccountsQuery(options?: Omit<Urql.UseQueryArgs<never, EmailAccountsQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<EmailAccountsQuery, EmailAccountsQueryVariables | undefined>({ query: EmailAccountsDocument, variables: undefined, ...options });
};
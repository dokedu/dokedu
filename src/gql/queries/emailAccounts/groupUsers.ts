import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GroupUsersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GroupUsersQuery = (
  { __typename?: 'Query' }
  & { emailAccounts?: Types.Maybe<(
    { __typename?: 'EmailAccountConnection' }
    & { edges?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'EmailAccount' }
      & Pick<Types.EmailAccount, 'id' | 'name'>
    )>>> }
  )> }
);


export const GroupUsersDocument = gql`
    query groupUsers {
  emailAccounts(filter: {type: INDIVIDUAL}) {
    edges {
      id
      name
    }
  }
}
    `;

export function useGroupUsersQuery(options: Omit<Urql.UseQueryArgs<never, GroupUsersQueryVariables>, 'query'>) {
  return Urql.useQuery<GroupUsersQuery, GroupUsersQueryVariables>({ query: GroupUsersDocument, ...options });
};
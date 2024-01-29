import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ChatUsersQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type ChatUsersQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', edges?: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email?: string | null } | null> | null } };


export const ChatUsersDocument = gql`
    query chatUsers($search: String) {
  users(search: $search, limit: 1000) {
    edges {
      id
      firstName
      lastName
      email
    }
  }
}
    `;

export function useChatUsersQuery(options: Omit<Urql.UseQueryArgs<never, ChatUsersQueryVariables>, 'query'>) {
  return Urql.useQuery<ChatUsersQuery, ChatUsersQueryVariables>({ query: ChatUsersDocument, ...options });
};
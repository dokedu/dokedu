import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ChatWithMembersQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ChatWithMembersQuery = { __typename?: 'Query', chat: { __typename?: 'Chat', id: string, name?: string | null, type: Types.ChatType, users: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email?: string | null }> } };


export const ChatWithMembersDocument = gql`
    query chatWithMembers($id: ID!) {
  chat(id: $id) {
    id
    name
    type
    users {
      id
      firstName
      lastName
      email
    }
  }
}
    `;

export function useChatWithMembersQuery(options: Omit<Urql.UseQueryArgs<never, ChatWithMembersQueryVariables>, 'query'>) {
  return Urql.useQuery<ChatWithMembersQuery, ChatWithMembersQueryVariables>({ query: ChatWithMembersDocument, ...options });
};
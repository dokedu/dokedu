import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UserByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type UserByIdQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, firstName: string, lastName: string, student?: { __typename?: 'UserStudent', id: string, grade: number, joinedAt?: never | null, leftAt?: never | null, entriesCount: number, competencesCount: number, eventsCount: number, emoji?: string | null } | null } };


export const UserByIdDocument = gql`
    query userById($id: ID!) {
  user(id: $id) {
    id
    firstName
    lastName
    student {
      id
      grade
      joinedAt
      leftAt
      entriesCount
      competencesCount
      eventsCount
      emoji
    }
  }
}
    `;

export function useUserByIdQuery(options: Omit<Urql.UseQueryArgs<never, UserByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<UserByIdQuery, UserByIdQueryVariables>({ query: UserByIdDocument, ...options });
};
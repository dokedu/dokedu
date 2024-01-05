import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetEntryFilterStudentsQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetEntryFilterStudentsQuery = (
  { __typename?: 'Query' }
  & { users: (
    { __typename?: 'UserConnection' }
    & { edges?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstName' | 'lastName'>
    )>>> }
  ) }
);


export const GetEntryFilterStudentsDocument = gql`
    query getEntryFilterStudents($search: String) {
  users(filter: {role: [student]}, limit: 200, search: $search) {
    edges {
      id
      firstName
      lastName
    }
  }
}
    `;

export function useGetEntryFilterStudentsQuery(options: Omit<Urql.UseQueryArgs<never, GetEntryFilterStudentsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetEntryFilterStudentsQuery, GetEntryFilterStudentsQueryVariables>({ query: GetEntryFilterStudentsDocument, ...options });
};
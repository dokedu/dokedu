import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetEntryFilterTeachersQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetEntryFilterTeachersQuery = (
  { __typename?: 'Query' }
  & { users: (
    { __typename?: 'UserConnection' }
    & { edges?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstName' | 'lastName'>
    )>>> }
  ) }
);


export const GetEntryFilterTeachersDocument = gql`
    query getEntryFilterTeachers($search: String) {
  users(
    filter: {role: [owner, admin, teacher, educator]}
    limit: 500
    search: $search
  ) {
    edges {
      id
      firstName
      lastName
    }
  }
}
    `;

export function useGetEntryFilterTeachersQuery(options: Omit<Urql.UseQueryArgs<never, GetEntryFilterTeachersQueryVariables>, 'query'>) {
  return Urql.useQuery<GetEntryFilterTeachersQuery, GetEntryFilterTeachersQueryVariables>({ query: GetEntryFilterTeachersDocument, ...options });
};
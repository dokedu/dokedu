import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetEntryFilterTeachersQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetEntryFilterTeachersQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', edges?: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string } | null> | null } };


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

export function useGetEntryFilterTeachersQuery(options?: Omit<Urql.UseQueryArgs<never, GetEntryFilterTeachersQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GetEntryFilterTeachersQuery, GetEntryFilterTeachersQueryVariables | undefined>({ query: GetEntryFilterTeachersDocument, variables: undefined, ...options });
};
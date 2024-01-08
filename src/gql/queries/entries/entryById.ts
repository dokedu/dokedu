import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EntryByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type EntryByIdQuery = { __typename?: 'Query', entry: { __typename?: 'Entry', id: string, date: string, body?: string | null, deletedAt?: never | null, createdAt: never, user: { __typename?: 'User', id: string, firstName: string, lastName: string }, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: string }>, events: Array<{ __typename?: 'Event', id: string, title: string }>, users: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string }>, userCompetences: Array<{ __typename?: 'UserCompetence', id: string, level: number, competence: { __typename?: 'Competence', id: string, name: string, color: string, type: Types.CompetenceType, grades: Array<number>, parents: Array<{ __typename?: 'Competence', id: string, name: string, grades: Array<number>, color: string }> } }> } };


export const EntryByIdDocument = gql`
    query entryById($id: ID!) {
  entry(id: $id) {
    id
    date
    body
    deletedAt
    user {
      id
      firstName
      lastName
    }
    createdAt
    tags {
      id
      name
      color
    }
    events {
      id
      title
    }
    users {
      id
      firstName
      lastName
    }
    userCompetences {
      id
      level
      competence {
        id
        name
        color
        type
        grades
        parents {
          id
          name
          grades
          color
        }
      }
    }
  }
}
    `;

export function useEntryByIdQuery(options: Omit<Urql.UseQueryArgs<never, EntryByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<EntryByIdQuery, EntryByIdQueryVariables>({ query: EntryByIdDocument, ...options });
};
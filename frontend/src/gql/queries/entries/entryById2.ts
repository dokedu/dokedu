import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FileFragementFragment = { __typename?: 'File', id: string, name: string, fileType: Types.FileType, MIMEType: string, size: number, createdAt: never };

export type EntryById2QueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type EntryById2Query = { __typename?: 'Query', entry: { __typename?: 'Entry', id: string, date: string, body?: string | null, deletedAt?: never | null, createdAt: never, user: { __typename?: 'User', id: string, firstName: string, lastName: string }, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: string }>, events: Array<{ __typename?: 'Event', id: string, title: string }>, users: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, student?: { __typename?: 'UserStudent', id: string, emoji?: string | null } | null }>, userCompetences: Array<{ __typename?: 'UserCompetence', id: string, level: number, competence: { __typename?: 'Competence', id: string, name: string, color: string, type: Types.CompetenceType, grades: Array<number>, parents: Array<{ __typename?: 'Competence', id: string, name: string, grades: Array<number>, color: string }> } }>, files: Array<{ __typename?: 'File', id: string, name: string, fileType: Types.FileType, MIMEType: string, size: number, createdAt: never }> } };

export const FileFragementFragmentDoc = gql`
    fragment FileFragement on File {
  id
  name
  fileType
  MIMEType
  size
  createdAt
}
    `;
export const EntryById2Document = gql`
    query entryById2($id: ID!) {
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
      student {
        id
        emoji
      }
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
    files {
      ...FileFragement
    }
  }
}
    ${FileFragementFragmentDoc}`;

export function useEntryById2Query(options?: Omit<Urql.UseQueryArgs<never, EntryById2QueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<EntryById2Query, EntryById2QueryVariables | undefined>({ query: EntryById2Document, variables: undefined, ...options });
};
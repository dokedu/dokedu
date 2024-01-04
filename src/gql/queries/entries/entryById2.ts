import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EntryById2QueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type EntryById2Query = (
  { __typename?: 'Query' }
  & { entry: (
    { __typename?: 'Entry' }
    & Pick<Types.Entry, 'id' | 'date' | 'body' | 'deletedAt' | 'createdAt'>
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstName' | 'lastName'>
    ), tags: Array<(
      { __typename?: 'Tag' }
      & Pick<Types.Tag, 'id' | 'name' | 'color'>
    )>, events: Array<(
      { __typename?: 'Event' }
      & Pick<Types.Event, 'id' | 'title'>
    )>, users: Array<(
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstName' | 'lastName'>
      & { student?: Types.Maybe<(
        { __typename?: 'UserStudent' }
        & Pick<Types.UserStudent, 'id' | 'emoji'>
      )> }
    )>, userCompetences: Array<(
      { __typename?: 'UserCompetence' }
      & Pick<Types.UserCompetence, 'id' | 'level'>
      & { competence: (
        { __typename?: 'Competence' }
        & Pick<Types.Competence, 'id' | 'name' | 'color' | 'type' | 'grades'>
        & { parents: Array<(
          { __typename?: 'Competence' }
          & Pick<Types.Competence, 'id' | 'name' | 'grades' | 'color'>
        )> }
      ) }
    )> }
  ) }
);


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
  }
}
    `;

export function useEntryById2Query(options: Omit<Urql.UseQueryArgs<never, EntryById2QueryVariables>, 'query'>) {
  return Urql.useQuery<EntryById2Query, EntryById2QueryVariables>({ query: EntryById2Document, ...options });
};
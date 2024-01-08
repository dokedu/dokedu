import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EventQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type EventQuery = { __typename?: 'Query', event: { __typename?: 'Event', id: string, title: string, body?: string | null, createdAt: never, startsAt: never, endsAt: never, competences: Array<{ __typename?: 'Competence', id: string, name: string, type: Types.CompetenceType, grades: Array<number>, parents: Array<{ __typename?: 'Competence', id: string, name: string, type: Types.CompetenceType, grades: Array<number>, color: string }> }> } };


export const EventDocument = gql`
    query event($id: ID!) {
  event(id: $id) {
    id
    title
    body
    createdAt
    startsAt
    endsAt
    competences {
      id
      name
      type
      grades
      parents {
        id
        name
        type
        grades
        color
      }
    }
  }
}
    `;

export function useEventQuery(options: Omit<Urql.UseQueryArgs<never, EventQueryVariables>, 'query'>) {
  return Urql.useQuery<EventQuery, EventQueryVariables>({ query: EventDocument, ...options });
};
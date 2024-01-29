import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateEventMutationVariables = Types.Exact<{
  input: Types.UpdateEventInput;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent: { __typename?: 'Event', id: string, title: string, body?: string | null, startsAt: never, endsAt: never, recurrence?: Array<string | null> | null, createdAt: never, image?: { __typename?: 'File', id: string } | null } };


export const UpdateEventDocument = gql`
    mutation updateEvent($input: UpdateEventInput!) {
  updateEvent(input: $input) {
    id
    title
    image {
      id
    }
    body
    startsAt
    endsAt
    recurrence
    createdAt
  }
}
    `;

export function useUpdateEventMutation() {
  return Urql.useMutation<UpdateEventMutation, UpdateEventMutationVariables>(UpdateEventDocument);
};
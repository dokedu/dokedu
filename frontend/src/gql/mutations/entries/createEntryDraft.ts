import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateEntryDraftMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type CreateEntryDraftMutation = { __typename?: 'Mutation', createEntry: { __typename?: 'Entry', id: string } };


export const CreateEntryDraftDocument = gql`
    mutation createEntryDraft {
  createEntry {
    id
  }
}
    `;

export function useCreateEntryDraftMutation() {
  return Urql.useMutation<CreateEntryDraftMutation, CreateEntryDraftMutationVariables>(CreateEntryDraftDocument);
};
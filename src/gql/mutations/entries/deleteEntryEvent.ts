import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type DeleteEntryEventInputMutationVariables = Types.Exact<{
  input: Types.DeleteEntryEventInput;
}>;


export type DeleteEntryEventInputMutation = (
  { __typename?: 'Mutation' }
  & { deleteEntryEvent: (
    { __typename?: 'Entry' }
    & Pick<Types.Entry, 'id'>
  ) }
);


export const DeleteEntryEventInputDocument = gql`
    mutation deleteEntryEventInput($input: DeleteEntryEventInput!) {
  deleteEntryEvent(input: $input) {
    id
  }
}
    `;

export function useDeleteEntryEventInputMutation() {
  return Urql.useMutation<DeleteEntryEventInputMutation, DeleteEntryEventInputMutationVariables>(DeleteEntryEventInputDocument);
};
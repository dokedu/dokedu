import type * as Types from '../../schema';

import gql from 'graphql-tag';
import { ChatMessageFragmentDoc } from '../../fragments/chatMessage';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EditChatMessageMutationVariables = Types.Exact<{
  input: Types.EditChatMessageInput;
}>;


export type EditChatMessageMutation = { __typename?: 'Mutation', editChatMessage: { __typename?: 'ChatMessage', id: string, message: string, isEdited: boolean, createdAt: never, user: { __typename?: 'User', id: string, firstName: string, lastName: string, email?: string | null } } };


export const EditChatMessageDocument = gql`
    mutation editChatMessage($input: EditChatMessageInput!) {
  editChatMessage(input: $input) {
    ...chatMessage
  }
}
    ${ChatMessageFragmentDoc}`;

export function useEditChatMessageMutation() {
  return Urql.useMutation<EditChatMessageMutation, EditChatMessageMutationVariables>(EditChatMessageDocument);
};
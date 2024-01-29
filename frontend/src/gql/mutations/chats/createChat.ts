import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateChatMutationVariables = Types.Exact<{
  input: Types.CreateChatInput;
}>;


export type CreateChatMutation = { __typename?: 'Mutation', createChat: { __typename?: 'Chat', id: string, name?: string | null, createdAt: never } };


export const CreateChatDocument = gql`
    mutation createChat($input: CreateChatInput!) {
  createChat(input: $input) {
    id
    name
    createdAt
  }
}
    `;

export function useCreateChatMutation() {
  return Urql.useMutation<CreateChatMutation, CreateChatMutationVariables>(CreateChatDocument);
};
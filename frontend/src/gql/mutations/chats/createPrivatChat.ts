import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreatePrivatChatMutationVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type CreatePrivatChatMutation = { __typename?: 'Mutation', createPrivatChat: { __typename?: 'Chat', id: string, name?: string | null, type: Types.ChatType, createdAt: never } };


export const CreatePrivatChatDocument = gql`
    mutation createPrivatChat($userId: ID!) {
  createPrivatChat(userId: $userId) {
    id
    name
    type
    createdAt
  }
}
    `;

export function useCreatePrivatChatMutation() {
  return Urql.useMutation<CreatePrivatChatMutation, CreatePrivatChatMutationVariables>(CreatePrivatChatDocument);
};
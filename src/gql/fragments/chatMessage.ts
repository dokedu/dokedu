import type * as Types from '../schema';

import gql from 'graphql-tag';
export type ChatMessageFragment = { __typename?: 'ChatMessage', id: string, message: string, isEdited: boolean, createdAt: never, user: { __typename?: 'User', id: string, firstName: string, lastName: string, email?: string | null } };

export const ChatMessageFragmentDoc = gql`
    fragment chatMessage on ChatMessage {
  id
  message
  user {
    id
    firstName
    lastName
    email
  }
  isEdited
  createdAt
}
    `;
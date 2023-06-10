/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Time: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type Chat = {
  __typename?: 'Chat';
  id: Scalars['ID']['output'];
  messages: Array<ChatMessage>;
  name?: Maybe<Scalars['String']['output']>;
  users: Array<User>;
};

export type ChatConnection = {
  __typename?: 'ChatConnection';
  edges?: Maybe<Array<Maybe<Chat>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ChatMessage = {
  __typename?: 'ChatMessage';
  chat: Chat;
  createdAt: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  user: User;
};

export type ChatUser = {
  __typename?: 'ChatUser';
  chat: Chat;
  id: Scalars['ID']['output'];
  user: User;
};

export type Competence = {
  __typename?: 'Competence';
  color: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  grades: Array<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parents: Array<Competence>;
  type: CompetenceType;
};

export type CompetenceConnection = {
  __typename?: 'CompetenceConnection';
  edges?: Maybe<Array<Maybe<Competence>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CompetenceFilterInput = {
  parents?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  type?: InputMaybe<Array<InputMaybe<CompetenceType>>>;
};

export enum CompetenceType {
  Competence = 'competence',
  Group = 'group',
  Subject = 'subject'
}

export type CreateEntryInput = {
  body: Scalars['String']['input'];
  date: Scalars['String']['input'];
  eventIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  fileIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  userCompetences?: InputMaybe<Array<CreateUserCompetenceInput>>;
  userIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type CreateFolderInput = {
  folderId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  sharedDriveId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateReportInput = {
  filterTags: Array<Scalars['ID']['input']>;
  format: ReportFormat;
  from: Scalars['Time']['input'];
  kind: ReportKind;
  meta: Scalars['String']['input'];
  studentUser: Scalars['ID']['input'];
  to: Scalars['Time']['input'];
};

export type CreateTagInput = {
  color: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateUserCompetenceInput = {
  competenceId: Scalars['ID']['input'];
  level: Scalars['Int']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateUserInput = {
  birthday?: InputMaybe<Scalars['Time']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  joinedAt?: InputMaybe<Scalars['Time']['input']>;
  lastName: Scalars['String']['input'];
  leftAt?: InputMaybe<Scalars['Time']['input']>;
  role: UserRole;
};

export type Entry = {
  __typename?: 'Entry';
  body?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  date: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  events: Array<Event>;
  files: Array<File>;
  id: Scalars['ID']['output'];
  tags: Array<Tag>;
  user: User;
  userCompetences: Array<UserCompetence>;
  users: Array<User>;
};

export type EntryConnection = {
  __typename?: 'EntryConnection';
  edges?: Maybe<Array<Maybe<Entry>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type EntryFilterInput = {
  authors?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  competences?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  from?: InputMaybe<Scalars['Time']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  to?: InputMaybe<Scalars['Time']['input']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type Event = {
  __typename?: 'Event';
  body?: Maybe<Scalars['String']['output']>;
  competences: Array<Competence>;
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  endsAt: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<File>;
  recurrence?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  startsAt: Scalars['Time']['output'];
  title: Scalars['String']['output'];
};

export type EventConnection = {
  __typename?: 'EventConnection';
  edges?: Maybe<Array<Maybe<Event>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type EventFilterInput = {
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  from?: InputMaybe<Scalars['Time']['input']>;
  to?: InputMaybe<Scalars['Time']['input']>;
};

export type File = {
  __typename?: 'File';
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  fileSize: Scalars['Int']['output'];
  fileType: FileType;
  files: Array<File>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<File>;
};

export enum FileType {
  Blob = 'blob',
  Folder = 'folder'
}

export type FileUploadInput = {
  file: Scalars['Upload']['input'];
  /** The folder to upload the file to if empty the file will be uploaded to the root folder of the user. */
  folderId?: InputMaybe<Scalars['ID']['input']>;
  /** The shared drive to upload the file to if empty the file will be uploaded to the root folder of the user. */
  sharedDriveId?: InputMaybe<Scalars['ID']['input']>;
};

export type FilesFilterInput = {
  folderId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sharedDriveId?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvite: SignInPayload;
  archiveEntry: Entry;
  archiveTag: Tag;
  archiveUser: User;
  archiveUserCompetence: UserCompetence;
  createEntry: Entry;
  createFolder: File;
  createReport: Report;
  createTag: Tag;
  createUser: User;
  createUserCompetence: UserCompetence;
  inviteUser: User;
  signIn: SignInPayload;
  singleUpload: File;
  updateEntry: Entry;
  updatePassword: Scalars['Boolean']['output'];
  updateUser: User;
};


export type MutationAcceptInviteArgs = {
  input: SignUpInput;
  token: Scalars['String']['input'];
};


export type MutationArchiveEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationArchiveTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationArchiveUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationArchiveUserCompetenceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateEntryArgs = {
  input: CreateEntryInput;
};


export type MutationCreateFolderArgs = {
  input: CreateFolderInput;
};


export type MutationCreateReportArgs = {
  input: CreateReportInput;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateUserCompetenceArgs = {
  input: CreateUserCompetenceInput;
};


export type MutationInviteUserArgs = {
  input: CreateUserInput;
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationSingleUploadArgs = {
  input: FileUploadInput;
};


export type MutationUpdateEntryArgs = {
  input: UpdateEntryInput;
};


export type MutationUpdatePasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Organisation = {
  __typename?: 'Organisation';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner: User;
};

export type OrganisationConnection = {
  __typename?: 'OrganisationConnection';
  edges?: Maybe<Array<Maybe<Organisation>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  currentPage: Scalars['Int']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  chat: Chat;
  chats: ChatConnection;
  competence: Competence;
  competences: CompetenceConnection;
  entries: EntryConnection;
  entry: Entry;
  event: Event;
  events: EventConnection;
  file: File;
  files: Array<File>;
  organisation: Organisation;
  report: Report;
  reports: ReportConnection;
  sharedDrives: Array<SharedDrive>;
  tag: Tag;
  tags: Array<Tag>;
  user: User;
  userFiles: Array<File>;
  users: UserConnection;
};


export type QueryChatArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChatsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCompetenceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCompetencesArgs = {
  filter?: InputMaybe<CompetenceFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEntriesArgs = {
  filter?: InputMaybe<EntryFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventsArgs = {
  filter?: InputMaybe<EventFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFilesArgs = {
  input?: InputMaybe<FilesFilterInput>;
};


export type QueryReportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySharedDrivesArgs = {
  input?: InputMaybe<SharedDriveFilterInput>;
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserFilesArgs = {
  input?: InputMaybe<UserFileFilterInput>;
};


export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Report = {
  __typename?: 'Report';
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  file?: Maybe<File>;
  filterTags: Array<Scalars['ID']['output']>;
  format: ReportFormat;
  from: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  kind: ReportKind;
  meta: Scalars['String']['output'];
  status: ReportStatus;
  studentUser: User;
  to: Scalars['Time']['output'];
  user: User;
};

export type ReportConnection = {
  __typename?: 'ReportConnection';
  edges?: Maybe<Array<Maybe<Report>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum ReportFormat {
  Docx = 'docx',
  Pdf = 'pdf'
}

export enum ReportKind {
  Report = 'report',
  Subject = 'subject'
}

export enum ReportStatus {
  Done = 'done',
  Error = 'error',
  Pending = 'pending',
  Processing = 'processing'
}

export type SharedDrive = {
  __typename?: 'SharedDrive';
  createdAt: Scalars['Time']['output'];
  files: Array<File>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type SharedDriveFilterInput = {
  folder?: InputMaybe<Scalars['String']['input']>;
};

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignInPayload = {
  __typename?: 'SignInPayload';
  token: Scalars['String']['output'];
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Tag = {
  __typename?: 'Tag';
  color: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type UpdateEntryInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  eventIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  fileIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  id: Scalars['ID']['input'];
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  userCompetences?: InputMaybe<Array<UpdateUserCompetenceInput>>;
  userIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateUserCompetenceInput = {
  competenceId: Scalars['ID']['input'];
  level: Scalars['Int']['input'];
  userId: Scalars['ID']['input'];
};

export type UpdateUserInput = {
  birthday?: InputMaybe<Scalars['Time']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  joinedAt?: InputMaybe<Scalars['Time']['input']>;
  lastName: Scalars['String']['input'];
  leftAt?: InputMaybe<Scalars['Time']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  role: UserRole;
};

export type UserCompetence = {
  __typename?: 'UserCompetence';
  competence: Competence;
  createdAt: Scalars['Time']['output'];
  entry?: Maybe<Entry>;
  id: Scalars['ID']['output'];
  level: Scalars['Int']['output'];
  user: User;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges?: Maybe<Array<Maybe<User>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserFileFilterInput = {
  folderId?: InputMaybe<Scalars['String']['input']>;
};

export type UserFilterInput = {
  role?: InputMaybe<Array<InputMaybe<UserRole>>>;
};

export enum UserRole {
  Admin = 'admin',
  Educator = 'educator',
  Owner = 'owner',
  Parent = 'parent',
  Student = 'student',
  Teacher = 'teacher'
}

export type SingleUploadMutationVariables = Exact<{
  input: FileUploadInput;
}>;


export type SingleUploadMutation = { __typename?: 'Mutation', singleUpload: { __typename?: 'File', id: string } };

export type CreateFolderMutationVariables = Exact<{
  input: CreateFolderInput;
}>;


export type CreateFolderMutation = { __typename?: 'Mutation', createFolder: { __typename?: 'File', id: string } };

export type UserFilesQueryVariables = Exact<{
  input?: InputMaybe<UserFileFilterInput>;
}>;


export type UserFilesQuery = { __typename?: 'Query', userFiles: Array<{ __typename?: 'File', id: string, name: string, fileType: FileType, fileSize: number }> };

export type FileQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FileQuery = { __typename?: 'Query', file: { __typename?: 'File', id: string, name: string, fileType: FileType } };

export type CreateEntryMutationVariables = Exact<{
  input: CreateEntryInput;
}>;


export type CreateEntryMutation = { __typename?: 'Mutation', createEntry: { __typename?: 'Entry', id: string, date: string, body?: string | null, deletedAt?: any | null, createdAt: any, user: { __typename?: 'User', id: string, firstName: string, lastName: string }, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: string }>, events: Array<{ __typename?: 'Event', id: string, title: string }>, users: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string }>, userCompetences: Array<{ __typename?: 'UserCompetence', id: string, level: number, competence: { __typename?: 'Competence', id: string, name: string, color: string, type: CompetenceType } }> } };

export type UpdateEntryMutationVariables = Exact<{
  input: UpdateEntryInput;
}>;


export type UpdateEntryMutation = { __typename?: 'Mutation', updateEntry: { __typename?: 'Entry', id: string, date: string, body?: string | null, deletedAt?: any | null, createdAt: any, user: { __typename?: 'User', id: string, firstName: string, lastName: string }, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: string }>, events: Array<{ __typename?: 'Event', id: string, title: string }>, users: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string }>, userCompetences: Array<{ __typename?: 'UserCompetence', id: string, level: number, competence: { __typename?: 'Competence', id: string, name: string, color: string, type: CompetenceType } }> } };

export type CompetencesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<CompetenceFilterInput>;
}>;


export type CompetencesQuery = { __typename?: 'Query', competences: { __typename?: 'CompetenceConnection', edges?: Array<{ __typename?: 'Competence', id: string, name: string, type: CompetenceType, color: string, grades: Array<number> } | null> | null } };

export type EventsQueryVariables = Exact<{ [key: string]: never; }>;


export type EventsQuery = { __typename?: 'Query', events: { __typename?: 'EventConnection', edges?: Array<{ __typename?: 'Event', id: string, title: string } | null> | null } };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', edges?: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string } | null> | null } };

export type EntryByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EntryByIdQuery = { __typename?: 'Query', entry: { __typename?: 'Entry', id: string, date: string, body?: string | null, deletedAt?: any | null, createdAt: any, user: { __typename?: 'User', id: string, firstName: string, lastName: string }, tags: Array<{ __typename?: 'Tag', id: string, name: string, color: string }>, events: Array<{ __typename?: 'Event', id: string, title: string }>, users: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string }>, userCompetences: Array<{ __typename?: 'UserCompetence', id: string, level: number, competence: { __typename?: 'Competence', id: string, name: string, color: string, type: CompetenceType } }> } };

export type EventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EventQuery = { __typename?: 'Query', event: { __typename?: 'Event', id: string, title: string, body?: string | null, createdAt: any, startsAt: any, endsAt: any } };

export type UserByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UserByIdQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, firstName: string, lastName: string, role: UserRole } };

export type ArchiveEntryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ArchiveEntryMutation = { __typename?: 'Mutation', archiveEntry: { __typename?: 'Entry', id: string } };

export type SignInMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'SignInPayload', token: string } };


export const SingleUploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"singleUpload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileUploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"singleUpload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SingleUploadMutation, SingleUploadMutationVariables>;
export const CreateFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFolderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFolder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateFolderMutation, CreateFolderMutationVariables>;
export const UserFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFileFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}}]}}]}}]} as unknown as DocumentNode<UserFilesQuery, UserFilesQueryVariables>;
export const FileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"file"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}}]}}]}}]} as unknown as DocumentNode<FileQuery, FileQueryVariables>;
export const CreateEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userCompetences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"competence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateEntryMutation, CreateEntryMutationVariables>;
export const UpdateEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userCompetences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"competence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEntryMutation, UpdateEntryMutationVariables>;
export const CompetencesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"competences"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CompetenceFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"competences"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"grades"}}]}}]}}]}}]} as unknown as DocumentNode<CompetencesQuery, CompetencesQueryVariables>;
export const EventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<EventsQuery, EventsQueryVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"student"}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const EntryByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"entryById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userCompetences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"competence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EntryByIdQuery, EntryByIdQueryVariables>;
export const EventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"event"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}}]}}]}}]} as unknown as DocumentNode<EventQuery, EventQueryVariables>;
export const UserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<UserByIdQuery, UserByIdQueryVariables>;
export const ArchiveEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"archiveEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ArchiveEntryMutation, ArchiveEntryMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
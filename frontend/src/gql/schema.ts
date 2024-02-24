import { cacheExchange } from '@urql/exchange-graphcache';
import type { Resolver as GraphCacheResolver, UpdateResolver as GraphCacheUpdateResolver, OptimisticMutationResolver as GraphCacheOptimisticMutationResolver } from '@urql/exchange-graphcache';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Time: { input: never; output: never; }
  Upload: { input: never; output: never; }
};

export type AddEventCompetenceInput = {
  competenceId: Scalars['ID']['input'];
  eventId: Scalars['ID']['input'];
};

export type AddUserToChatInput = {
  chatId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type Chat = {
  __typename?: 'Chat';
  createdAt: Scalars['Time']['output'];
  deleted: Scalars['Boolean']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  id: Scalars['ID']['output'];
  lastMessage?: Maybe<ChatMessage>;
  messages: Array<ChatMessage>;
  name?: Maybe<Scalars['String']['output']>;
  type: ChatType;
  unreadMessageCount: Scalars['Int']['output'];
  userCount: Scalars['Int']['output'];
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
  isEdited: Scalars['Boolean']['output'];
  isSeen: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  user: User;
};

export enum ChatType {
  Ai = 'AI',
  Channel = 'CHANNEL',
  Group = 'GROUP',
  Private = 'PRIVATE'
}

export type ChatUser = {
  __typename?: 'ChatUser';
  chat: Chat;
  id: Scalars['ID']['output'];
  user: User;
};

export type Competence = {
  __typename?: 'Competence';
  color: Scalars['String']['output'];
  competences: Array<Maybe<Competence>>;
  createdAt: Scalars['Time']['output'];
  grades: Array<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parents: Array<Competence>;
  sortOrder: Scalars['Int']['output'];
  tendency?: Maybe<CompetenceTendency>;
  type: CompetenceType;
  userCompetences: Array<Maybe<UserCompetence>>;
};


export type CompetenceCompetencesArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<CompetenceSort>;
};


export type CompetenceTendencyArgs = {
  userId: Scalars['ID']['input'];
};


export type CompetenceUserCompetencesArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
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
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type CompetenceSort = {
  field: CompetenceSortField;
  order: SortDirection;
};

export enum CompetenceSortField {
  CreatedAt = 'created_at',
  Name = 'name',
  SortOrder = 'sort_order'
}

export type CompetenceTendency = {
  __typename?: 'CompetenceTendency';
  countChildCompetences: Scalars['Int']['output'];
  countLearnedCompetences: Scalars['Int']['output'];
  tendency: Scalars['Float']['output'];
};

export enum CompetenceType {
  Competence = 'competence',
  Group = 'group',
  Subject = 'subject'
}

export type CreateChatInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCompetenceInput = {
  name: Scalars['String']['input'];
  parentId: Scalars['ID']['input'];
};

export type CreateEntryCompetenceInput = {
  competenceId: Scalars['ID']['input'];
  entryId: Scalars['ID']['input'];
};

export type CreateEntryEventInput = {
  entryId: Scalars['ID']['input'];
  eventId: Scalars['ID']['input'];
};

export type CreateEntryFileInput = {
  entryId: Scalars['ID']['input'];
  fileId: Scalars['ID']['input'];
};

export type CreateEntryTagInput = {
  entryId: Scalars['ID']['input'];
  tagId: Scalars['ID']['input'];
};

export type CreateEntryUserInput = {
  entryId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateEventInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  endsAt?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  recurrence?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsAt?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateFileInput = {
  folderId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  type: FileType;
  upload?: InputMaybe<Scalars['Upload']['input']>;
};

export type CreateFilePayload = {
  __typename?: 'CreateFilePayload';
  file: File;
};

export type CreateFilePermissionInput = {
  fileId: Scalars['ID']['input'];
  permission: FilePermissionRole;
  userId: Scalars['ID']['input'];
};

export type CreateFilePermissionPayload = {
  __typename?: 'CreateFilePermissionPayload';
  filePermission: FilePermission;
};

export type CreateReportInput = {
  allUsers?: InputMaybe<Scalars['Boolean']['input']>;
  filterTags: Array<Scalars['ID']['input']>;
  format: ReportFormat;
  from: Scalars['Time']['input'];
  kind: ReportKind;
  studentUser?: InputMaybe<Scalars['ID']['input']>;
  to: Scalars['Time']['input'];
};

export type CreateStudentInput = {
  birthday?: InputMaybe<Scalars['Time']['input']>;
  emoji?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  grade: Scalars['Int']['input'];
  joinedAt?: InputMaybe<Scalars['Time']['input']>;
  lastName: Scalars['String']['input'];
  leftAt?: InputMaybe<Scalars['Time']['input']>;
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

export type DeleteChatInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEntryCompetenceInput = {
  competenceId: Scalars['ID']['input'];
  entryId: Scalars['ID']['input'];
};

export type DeleteEntryEventInput = {
  entryId: Scalars['ID']['input'];
  eventId: Scalars['ID']['input'];
};

export type DeleteEntryFileInput = {
  entryId: Scalars['ID']['input'];
  fileId: Scalars['ID']['input'];
};

export type DeleteEntryTagInput = {
  entryId: Scalars['ID']['input'];
  tagId: Scalars['ID']['input'];
};

export type DeleteEntryUserInput = {
  entryId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type DeleteFileInput = {
  id: Scalars['ID']['input'];
};

export type DeleteFilePayload = {
  __typename?: 'DeleteFilePayload';
  file: File;
};

export type DeleteFilePermissionInput = {
  id: Scalars['ID']['input'];
};

export type DeleteFilePermissionPayload = {
  __typename?: 'DeleteFilePermissionPayload';
  filePermission: FilePermission;
};

export type EditChatMessageInput = {
  id: Scalars['ID']['input'];
  message: Scalars['String']['input'];
};

export type Entry = {
  __typename?: 'Entry';
  body: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  date: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  events: Array<Event>;
  files: Array<File>;
  id: Scalars['ID']['output'];
  subjects: Array<Competence>;
  tags: Array<Tag>;
  user: User;
  userCompetences: Array<UserCompetence>;
  users: Array<User>;
};

export type EntryConnection = {
  __typename?: 'EntryConnection';
  edges: Array<Entry>;
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

export enum EntrySortBy {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC'
}

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

export enum EventOrderBy {
  EndsAtAsc = 'endsAt_ASC',
  EndsAtDesc = 'endsAt_DESC',
  StartsAtAsc = 'startsAt_ASC',
  StartsAtDesc = 'startsAt_DESC'
}

export type ExportEventsInput = {
  deleted: Scalars['Boolean']['input'];
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
};

export type ExportEventsPayload = {
  __typename?: 'ExportEventsPayload';
  body: Scalars['String']['output'];
  endsAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  startsAt: Scalars['String']['output'];
  subjects: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type File = {
  __typename?: 'File';
  children: Array<File>;
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  id: Scalars['ID']['output'];
  mime: Scalars['String']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<File>;
  parentsRecursive: Array<File>;
  permissions: Array<FilePermission>;
  size: Scalars['Int']['output'];
  type: FileType;
};

export type FileConnection = {
  __typename?: 'FileConnection';
  edges: Array<File>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FileFilterInput = {
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type FilePermission = {
  __typename?: 'FilePermission';
  displayName: Scalars['String']['output'];
  emailAddress?: Maybe<Scalars['String']['output']>;
  file: File;
  id: Scalars['ID']['output'];
  inherited: Scalars['Boolean']['output'];
  role: FilePermissionRole;
  type: FilePermissionType;
};

export enum FilePermissionRole {
  Manager = 'MANAGER',
  Viewer = 'VIEWER'
}

export enum FilePermissionType {
  Anyone = 'ANYONE',
  Domain = 'DOMAIN',
  Group = 'GROUP',
  User = 'USER'
}

export enum FileType {
  Blob = 'BLOB',
  Folder = 'FOLDER'
}

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
};

export type ForgotPasswordPayload = {
  __typename?: 'ForgotPasswordPayload';
  success: Scalars['Boolean']['output'];
};

export enum ImportStudentsError {
  DataWrong = 'DATA_WRONG',
  FormatWrong = 'FORMAT_WRONG',
  GradeWrong = 'GRADE_WRONG',
  HeaderWrong = 'HEADER_WRONG',
  PermissionDenied = 'PERMISSION_DENIED'
}

export type ImportStudentsInput = {
  file: Scalars['Upload']['input'];
};

export type ImportStudentsPayload = {
  __typename?: 'ImportStudentsPayload';
  errors: Array<ImportStudentsError>;
  usersCreated: Scalars['Int']['output'];
  usersExisted: Scalars['Int']['output'];
};

export type InviteDetailsPayload = {
  __typename?: 'InviteDetailsPayload';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvite: SignInPayload;
  addUserToChat: ChatUser;
  archiveEntry: Entry;
  archiveEvent: Event;
  archiveTag: Tag;
  archiveUser: User;
  archiveUserCompetence: UserCompetence;
  createChat: Chat;
  createCompetence: Competence;
  createEntry: Entry;
  createEntryCompetence: Entry;
  createEntryEvent: Entry;
  createEntryFile: Entry;
  createEntryTag: Entry;
  createEntryUser: Entry;
  createEvent: Event;
  createFile: CreateFilePayload;
  createFilePermission: CreateFilePermissionPayload;
  createPrivatChat: Chat;
  createReport: Array<Maybe<Report>>;
  createStudent: User;
  createTag: Tag;
  createUser: User;
  createUserCompetence: UserCompetence;
  deleteChat: Chat;
  deleteEntryCompetence: Entry;
  deleteEntryEvent: Entry;
  deleteEntryFile: Entry;
  deleteEntryTag: Entry;
  deleteEntryUser: Entry;
  deleteFile: DeleteFilePayload;
  deleteFilePermission: DeleteFilePermissionPayload;
  editChatMessage: ChatMessage;
  forgotPassword: Scalars['Boolean']['output'];
  importStudents: ImportStudentsPayload;
  markMessageAsRead: ChatMessage;
  removeFileFromEntry: File;
  removeUserFromChat: ChatUser;
  resetPassword: ResetPasswordPayload;
  sendMessage: ChatMessage;
  sendUserInvite: Scalars['Boolean']['output'];
  signIn: SignInPayload;
  signOut: Scalars['Boolean']['output'];
  toggleEventCompetence: Event;
  updateChat: Chat;
  updateCompetence: Competence;
  updateCompetenceSorting: Array<Maybe<Competence>>;
  updateEntry: Entry;
  updateEntryUserCompetenceLevel: Entry;
  updateEvent: Event;
  updateFile: UpdateFilePayload;
  updateFilePermission: UpdateFilePermissionPayload;
  updateOrganisation: Organisation;
  updatePassword: Scalars['Boolean']['output'];
  updateTag: Tag;
  updateUser: User;
  updateUserAttendance: UserAttendance;
  updateUserLanguage: User;
  uploadFileToEntry: Entry;
};


export type MutationAcceptInviteArgs = {
  input: SignUpInput;
  token: Scalars['String']['input'];
};


export type MutationAddUserToChatArgs = {
  input: AddUserToChatInput;
};


export type MutationArchiveEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationArchiveEventArgs = {
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


export type MutationCreateChatArgs = {
  input: CreateChatInput;
};


export type MutationCreateCompetenceArgs = {
  input: CreateCompetenceInput;
};


export type MutationCreateEntryCompetenceArgs = {
  input: CreateEntryCompetenceInput;
};


export type MutationCreateEntryEventArgs = {
  input: CreateEntryEventInput;
};


export type MutationCreateEntryFileArgs = {
  input: CreateEntryFileInput;
};


export type MutationCreateEntryTagArgs = {
  input: CreateEntryTagInput;
};


export type MutationCreateEntryUserArgs = {
  input: CreateEntryUserInput;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateFileArgs = {
  input: CreateFileInput;
};


export type MutationCreateFilePermissionArgs = {
  input: CreateFilePermissionInput;
};


export type MutationCreatePrivatChatArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationCreateReportArgs = {
  input: CreateReportInput;
};


export type MutationCreateStudentArgs = {
  input: CreateStudentInput;
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


export type MutationDeleteChatArgs = {
  input: DeleteChatInput;
};


export type MutationDeleteEntryCompetenceArgs = {
  input: DeleteEntryCompetenceInput;
};


export type MutationDeleteEntryEventArgs = {
  input: DeleteEntryEventInput;
};


export type MutationDeleteEntryFileArgs = {
  input: DeleteEntryFileInput;
};


export type MutationDeleteEntryTagArgs = {
  input: DeleteEntryTagInput;
};


export type MutationDeleteEntryUserArgs = {
  input: DeleteEntryUserInput;
};


export type MutationDeleteFileArgs = {
  input: DeleteFileInput;
};


export type MutationDeleteFilePermissionArgs = {
  input: DeleteFilePermissionInput;
};


export type MutationEditChatMessageArgs = {
  input: EditChatMessageInput;
};


export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};


export type MutationImportStudentsArgs = {
  input: ImportStudentsInput;
};


export type MutationMarkMessageAsReadArgs = {
  messageId: Scalars['ID']['input'];
};


export type MutationRemoveFileFromEntryArgs = {
  entryId: Scalars['ID']['input'];
  fileId: Scalars['ID']['input'];
};


export type MutationRemoveUserFromChatArgs = {
  input: RemoveUserFromChatInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationSendUserInviteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationToggleEventCompetenceArgs = {
  input: AddEventCompetenceInput;
};


export type MutationUpdateChatArgs = {
  input: UpdateChatInput;
};


export type MutationUpdateCompetenceArgs = {
  input: UpdateCompetenceInput;
};


export type MutationUpdateCompetenceSortingArgs = {
  input: UpdateCompetenceSortingInput;
};


export type MutationUpdateEntryArgs = {
  input: UpdateEntryInput;
};


export type MutationUpdateEntryUserCompetenceLevelArgs = {
  input: UpdateEntryUserCompetenceLevel;
};


export type MutationUpdateEventArgs = {
  input: UpdateEventInput;
};


export type MutationUpdateFileArgs = {
  input: UpdateFileInput;
};


export type MutationUpdateFilePermissionArgs = {
  input: UpdateFilePermissionInput;
};


export type MutationUpdateOrganisationArgs = {
  input: UpdateOrganisationInput;
};


export type MutationUpdatePasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationUpdateTagArgs = {
  id: Scalars['ID']['input'];
  input: CreateTagInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserAttendanceArgs = {
  input: UpdateUserAttendanceInput;
};


export type MutationUpdateUserLanguageArgs = {
  language: UserLanguage;
};


export type MutationUploadFileToEntryArgs = {
  entryId: Scalars['ID']['input'];
  file: Scalars['Upload']['input'];
};

export type Organisation = {
  __typename?: 'Organisation';
  applications: Array<OrganisationApplication>;
  id: Scalars['ID']['output'];
  legalName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  owner: User;
  phone?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export enum OrganisationApplication {
  Admin = 'ADMIN',
  Chat = 'CHAT',
  Drive = 'DRIVE',
  Email = 'EMAIL',
  Record = 'RECORD',
  School = 'SCHOOL'
}

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
  exportEvents: Array<Maybe<ExportEventsPayload>>;
  file: File;
  files: FileConnection;
  inviteDetails: InviteDetailsPayload;
  me: User;
  myDrive: FileConnection;
  organisation?: Maybe<Organisation>;
  report: Report;
  reports: ReportConnection;
  sharedDrives: FileConnection;
  tag: Tag;
  tags: TagConnection;
  trash: FileConnection;
  user: User;
  userAttendances: Array<UserAttendance>;
  userStudent: UserStudent;
  userStudents: UserStudentConnection;
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
  sort?: InputMaybe<CompetenceSort>;
};


export type QueryEntriesArgs = {
  filter?: InputMaybe<EntryFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<EntrySortBy>;
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
  order?: InputMaybe<EventOrderBy>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExportEventsArgs = {
  input: ExportEventsInput;
};


export type QueryFileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFilesArgs = {
  input?: InputMaybe<FileFilterInput>;
};


export type QueryInviteDetailsArgs = {
  token: Scalars['String']['input'];
};


export type QueryMyDriveArgs = {
  input?: InputMaybe<FileFilterInput>;
};


export type QueryReportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySharedDrivesArgs = {
  input?: InputMaybe<FileFilterInput>;
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTrashArgs = {
  input?: InputMaybe<FileFilterInput>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserAttendancesArgs = {
  date: Scalars['Time']['input'];
};


export type QueryUserStudentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserStudentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type RemoveUserFromChatInput = {
  chatId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
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
  AllEntries = 'all_entries',
  Competences = 'competences',
  Entries = 'entries',
  LearnedCompetences = 'learned_competences',
  Subjects = 'subjects'
}

export enum ReportStatus {
  Done = 'done',
  Error = 'error',
  Pending = 'pending',
  Processing = 'processing'
}

export type ResetPasswordInput = {
  password: Scalars['String']['input'];
  token?: InputMaybe<Scalars['String']['input']>;
};

export type ResetPasswordPayload = {
  __typename?: 'ResetPasswordPayload';
  organisation: Organisation;
  token: Scalars['String']['output'];
  user: User;
};

export type SendMessageInput = {
  chatId: Scalars['ID']['input'];
  message: Scalars['String']['input'];
};

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignInPayload = {
  __typename?: 'SignInPayload';
  organisation: Organisation;
  token: Scalars['String']['output'];
  user: User;
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SortCompetenceInput = {
  id: Scalars['ID']['input'];
  sortOrder: Scalars['Int']['input'];
};

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Subscription = {
  __typename?: 'Subscription';
  messageAdded: ChatMessage;
  reportCreatedOrUpdated: Report;
};

export type Tag = {
  __typename?: 'Tag';
  color: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type TagConnection = {
  __typename?: 'TagConnection';
  edges?: Maybe<Array<Maybe<Tag>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UpdateChatInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCompetenceInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type UpdateCompetenceSortingInput = {
  competences: Array<SortCompetenceInput>;
};

export type UpdateEntryInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type UpdateEntryUserCompetenceLevel = {
  competenceId: Scalars['ID']['input'];
  entryId: Scalars['ID']['input'];
  level: Scalars['Int']['input'];
};

export type UpdateEventInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  endsAt?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  recurrence?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsAt?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFileInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateFilePayload = {
  __typename?: 'UpdateFilePayload';
  file: File;
};

export type UpdateFilePermissionInput = {
  id: Scalars['ID']['input'];
  permission: FilePermissionRole;
};

export type UpdateFilePermissionPayload = {
  __typename?: 'UpdateFilePermissionPayload';
  filePermission: FilePermission;
};

export type UpdateOrganisationInput = {
  id: Scalars['ID']['input'];
  legalName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserAttendanceInput = {
  date: Scalars['Time']['input'];
  state: UserAttendanceState;
  userId: Scalars['ID']['input'];
};

export type UpdateUserCompetenceInput = {
  competenceId: Scalars['ID']['input'];
  level: Scalars['Int']['input'];
  userId: Scalars['ID']['input'];
};

export type UpdateUserInput = {
  birthday?: InputMaybe<Scalars['Time']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emoji?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  grade?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  joinedAt?: InputMaybe<Scalars['Time']['input']>;
  lastName: Scalars['String']['input'];
  leftAt?: InputMaybe<Scalars['Time']['input']>;
  missedHours?: InputMaybe<Scalars['Int']['input']>;
  missedHoursExcused?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  inviteAccepted: Scalars['Boolean']['output'];
  language?: Maybe<UserLanguage>;
  lastName: Scalars['String']['output'];
  lastSeenAt?: Maybe<Scalars['Time']['output']>;
  organisationId: Scalars['ID']['output'];
  role: UserRole;
  student?: Maybe<UserStudent>;
};

export type UserAttendance = {
  __typename?: 'UserAttendance';
  date: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  state: UserAttendanceState;
  user: User;
};

export enum UserAttendanceState {
  Absent = 'ABSENT',
  Late = 'LATE',
  Present = 'PRESENT',
  Sick = 'SICK',
  Unknown = 'UNKNOWN'
}

export type UserCompetence = {
  __typename?: 'UserCompetence';
  competence: Competence;
  createdAt: Scalars['Time']['output'];
  createdBy?: Maybe<User>;
  entry?: Maybe<Entry>;
  id: Scalars['ID']['output'];
  level: Scalars['Int']['output'];
  user: User;
};

export type UserCompetenceConnection = {
  __typename?: 'UserCompetenceConnection';
  edges?: Maybe<Array<Maybe<UserCompetence>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserCompetenceFilterInput = {
  competenceID?: InputMaybe<Scalars['ID']['input']>;
  userID?: InputMaybe<Scalars['ID']['input']>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges?: Maybe<Array<Maybe<User>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserFilterInput = {
  orderBy?: InputMaybe<UserOrderBy>;
  role?: InputMaybe<Array<InputMaybe<UserRole>>>;
  showDeleted?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum UserLanguage {
  De = 'de',
  En = 'en'
}

export enum UserOrderBy {
  FirstNameAsc = 'firstNameAsc',
  FirstNameDesc = 'firstNameDesc',
  LastNameAsc = 'lastNameAsc',
  LastNameDesc = 'lastNameDesc'
}

export enum UserRole {
  Admin = 'admin',
  Educator = 'educator',
  Owner = 'owner',
  Parent = 'parent',
  Student = 'student',
  Teacher = 'teacher'
}

export type UserStudent = {
  __typename?: 'UserStudent';
  birthday?: Maybe<Scalars['Time']['output']>;
  comments?: Maybe<Scalars['String']['output']>;
  competencesCount: Scalars['Int']['output'];
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  emoji?: Maybe<Scalars['String']['output']>;
  entriesCount: Scalars['Int']['output'];
  eventsCount: Scalars['Int']['output'];
  grade: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  joinedAt?: Maybe<Scalars['Time']['output']>;
  leftAt?: Maybe<Scalars['Time']['output']>;
  missedHours: Scalars['Int']['output'];
  missedHoursExcused: Scalars['Int']['output'];
  nationality?: Maybe<Scalars['String']['output']>;
  user: User;
};

export type UserStudentConnection = {
  __typename?: 'UserStudentConnection';
  edges?: Maybe<Array<Maybe<UserStudent>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WithTypename<T extends { __typename?: any }> = Partial<T> & { __typename: NonNullable<T['__typename']> };

export type GraphCacheKeysConfig = {
  Chat?: (data: WithTypename<Chat>) => null | string,
  ChatConnection?: (data: WithTypename<ChatConnection>) => null | string,
  ChatMessage?: (data: WithTypename<ChatMessage>) => null | string,
  ChatUser?: (data: WithTypename<ChatUser>) => null | string,
  Competence?: (data: WithTypename<Competence>) => null | string,
  CompetenceConnection?: (data: WithTypename<CompetenceConnection>) => null | string,
  CompetenceTendency?: (data: WithTypename<CompetenceTendency>) => null | string,
  CreateFilePayload?: (data: WithTypename<CreateFilePayload>) => null | string,
  CreateFilePermissionPayload?: (data: WithTypename<CreateFilePermissionPayload>) => null | string,
  DeleteFilePayload?: (data: WithTypename<DeleteFilePayload>) => null | string,
  DeleteFilePermissionPayload?: (data: WithTypename<DeleteFilePermissionPayload>) => null | string,
  Entry?: (data: WithTypename<Entry>) => null | string,
  EntryConnection?: (data: WithTypename<EntryConnection>) => null | string,
  Event?: (data: WithTypename<Event>) => null | string,
  EventConnection?: (data: WithTypename<EventConnection>) => null | string,
  ExportEventsPayload?: (data: WithTypename<ExportEventsPayload>) => null | string,
  File?: (data: WithTypename<File>) => null | string,
  FileConnection?: (data: WithTypename<FileConnection>) => null | string,
  FilePermission?: (data: WithTypename<FilePermission>) => null | string,
  ForgotPasswordPayload?: (data: WithTypename<ForgotPasswordPayload>) => null | string,
  ImportStudentsPayload?: (data: WithTypename<ImportStudentsPayload>) => null | string,
  InviteDetailsPayload?: (data: WithTypename<InviteDetailsPayload>) => null | string,
  Organisation?: (data: WithTypename<Organisation>) => null | string,
  PageInfo?: (data: WithTypename<PageInfo>) => null | string,
  Report?: (data: WithTypename<Report>) => null | string,
  ReportConnection?: (data: WithTypename<ReportConnection>) => null | string,
  ResetPasswordPayload?: (data: WithTypename<ResetPasswordPayload>) => null | string,
  SignInPayload?: (data: WithTypename<SignInPayload>) => null | string,
  Tag?: (data: WithTypename<Tag>) => null | string,
  TagConnection?: (data: WithTypename<TagConnection>) => null | string,
  UpdateFilePayload?: (data: WithTypename<UpdateFilePayload>) => null | string,
  UpdateFilePermissionPayload?: (data: WithTypename<UpdateFilePermissionPayload>) => null | string,
  User?: (data: WithTypename<User>) => null | string,
  UserAttendance?: (data: WithTypename<UserAttendance>) => null | string,
  UserCompetence?: (data: WithTypename<UserCompetence>) => null | string,
  UserCompetenceConnection?: (data: WithTypename<UserCompetenceConnection>) => null | string,
  UserConnection?: (data: WithTypename<UserConnection>) => null | string,
  UserStudent?: (data: WithTypename<UserStudent>) => null | string,
  UserStudentConnection?: (data: WithTypename<UserStudentConnection>) => null | string
}

export type GraphCacheResolvers = {
  Query?: {
    chat?: GraphCacheResolver<WithTypename<Query>, QueryChatArgs, WithTypename<Chat> | string>,
    chats?: GraphCacheResolver<WithTypename<Query>, QueryChatsArgs, WithTypename<ChatConnection> | string>,
    competence?: GraphCacheResolver<WithTypename<Query>, QueryCompetenceArgs, WithTypename<Competence> | string>,
    competences?: GraphCacheResolver<WithTypename<Query>, QueryCompetencesArgs, WithTypename<CompetenceConnection> | string>,
    entries?: GraphCacheResolver<WithTypename<Query>, QueryEntriesArgs, WithTypename<EntryConnection> | string>,
    entry?: GraphCacheResolver<WithTypename<Query>, QueryEntryArgs, WithTypename<Entry> | string>,
    event?: GraphCacheResolver<WithTypename<Query>, QueryEventArgs, WithTypename<Event> | string>,
    events?: GraphCacheResolver<WithTypename<Query>, QueryEventsArgs, WithTypename<EventConnection> | string>,
    exportEvents?: GraphCacheResolver<WithTypename<Query>, QueryExportEventsArgs, Array<WithTypename<ExportEventsPayload> | string>>,
    file?: GraphCacheResolver<WithTypename<Query>, QueryFileArgs, WithTypename<File> | string>,
    files?: GraphCacheResolver<WithTypename<Query>, QueryFilesArgs, WithTypename<FileConnection> | string>,
    inviteDetails?: GraphCacheResolver<WithTypename<Query>, QueryInviteDetailsArgs, WithTypename<InviteDetailsPayload> | string>,
    me?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<User> | string>,
    myDrive?: GraphCacheResolver<WithTypename<Query>, QueryMyDriveArgs, WithTypename<FileConnection> | string>,
    organisation?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<Organisation> | string>,
    report?: GraphCacheResolver<WithTypename<Query>, QueryReportArgs, WithTypename<Report> | string>,
    reports?: GraphCacheResolver<WithTypename<Query>, QueryReportsArgs, WithTypename<ReportConnection> | string>,
    sharedDrives?: GraphCacheResolver<WithTypename<Query>, QuerySharedDrivesArgs, WithTypename<FileConnection> | string>,
    tag?: GraphCacheResolver<WithTypename<Query>, QueryTagArgs, WithTypename<Tag> | string>,
    tags?: GraphCacheResolver<WithTypename<Query>, QueryTagsArgs, WithTypename<TagConnection> | string>,
    trash?: GraphCacheResolver<WithTypename<Query>, QueryTrashArgs, WithTypename<FileConnection> | string>,
    user?: GraphCacheResolver<WithTypename<Query>, QueryUserArgs, WithTypename<User> | string>,
    userAttendances?: GraphCacheResolver<WithTypename<Query>, QueryUserAttendancesArgs, Array<WithTypename<UserAttendance> | string>>,
    userStudent?: GraphCacheResolver<WithTypename<Query>, QueryUserStudentArgs, WithTypename<UserStudent> | string>,
    userStudents?: GraphCacheResolver<WithTypename<Query>, QueryUserStudentsArgs, WithTypename<UserStudentConnection> | string>,
    users?: GraphCacheResolver<WithTypename<Query>, QueryUsersArgs, WithTypename<UserConnection> | string>
  },
  Chat?: {
    createdAt?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Scalars['Time'] | string>,
    deleted?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Scalars['Boolean'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Scalars['Time'] | string>,
    id?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Scalars['ID'] | string>,
    lastMessage?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, WithTypename<ChatMessage> | string>,
    messages?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Array<WithTypename<ChatMessage> | string>>,
    name?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Scalars['String'] | string>,
    type?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, ChatType | string>,
    unreadMessageCount?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Scalars['Int'] | string>,
    userCount?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Scalars['Int'] | string>,
    users?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Array<WithTypename<User> | string>>
  },
  ChatConnection?: {
    edges?: GraphCacheResolver<WithTypename<ChatConnection>, Record<string, never>, Array<WithTypename<Chat> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<ChatConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<ChatConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  ChatMessage?: {
    chat?: GraphCacheResolver<WithTypename<ChatMessage>, Record<string, never>, WithTypename<Chat> | string>,
    createdAt?: GraphCacheResolver<WithTypename<ChatMessage>, Record<string, never>, Scalars['Time'] | string>,
    id?: GraphCacheResolver<WithTypename<ChatMessage>, Record<string, never>, Scalars['ID'] | string>,
    isEdited?: GraphCacheResolver<WithTypename<ChatMessage>, Record<string, never>, Scalars['Boolean'] | string>,
    isSeen?: GraphCacheResolver<WithTypename<ChatMessage>, Record<string, never>, Scalars['Boolean'] | string>,
    message?: GraphCacheResolver<WithTypename<ChatMessage>, Record<string, never>, Scalars['String'] | string>,
    user?: GraphCacheResolver<WithTypename<ChatMessage>, Record<string, never>, WithTypename<User> | string>
  },
  ChatUser?: {
    chat?: GraphCacheResolver<WithTypename<ChatUser>, Record<string, never>, WithTypename<Chat> | string>,
    id?: GraphCacheResolver<WithTypename<ChatUser>, Record<string, never>, Scalars['ID'] | string>,
    user?: GraphCacheResolver<WithTypename<ChatUser>, Record<string, never>, WithTypename<User> | string>
  },
  Competence?: {
    color?: GraphCacheResolver<WithTypename<Competence>, Record<string, never>, Scalars['String'] | string>,
    competences?: GraphCacheResolver<WithTypename<Competence>, CompetenceCompetencesArgs, Array<WithTypename<Competence> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<Competence>, Record<string, never>, Scalars['Time'] | string>,
    grades?: GraphCacheResolver<WithTypename<Competence>, Record<string, never>, Array<Scalars['Int'] | string>>,
    id?: GraphCacheResolver<WithTypename<Competence>, Record<string, never>, Scalars['ID'] | string>,
    name?: GraphCacheResolver<WithTypename<Competence>, Record<string, never>, Scalars['String'] | string>,
    parents?: GraphCacheResolver<WithTypename<Competence>, Record<string, never>, Array<WithTypename<Competence> | string>>,
    sortOrder?: GraphCacheResolver<WithTypename<Competence>, Record<string, never>, Scalars['Int'] | string>,
    tendency?: GraphCacheResolver<WithTypename<Competence>, CompetenceTendencyArgs, WithTypename<CompetenceTendency> | string>,
    type?: GraphCacheResolver<WithTypename<Competence>, Record<string, never>, CompetenceType | string>,
    userCompetences?: GraphCacheResolver<WithTypename<Competence>, CompetenceUserCompetencesArgs, Array<WithTypename<UserCompetence> | string>>
  },
  CompetenceConnection?: {
    edges?: GraphCacheResolver<WithTypename<CompetenceConnection>, Record<string, never>, Array<WithTypename<Competence> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<CompetenceConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<CompetenceConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  CompetenceTendency?: {
    countChildCompetences?: GraphCacheResolver<WithTypename<CompetenceTendency>, Record<string, never>, Scalars['Int'] | string>,
    countLearnedCompetences?: GraphCacheResolver<WithTypename<CompetenceTendency>, Record<string, never>, Scalars['Int'] | string>,
    tendency?: GraphCacheResolver<WithTypename<CompetenceTendency>, Record<string, never>, Scalars['Float'] | string>
  },
  CreateFilePayload?: {
    file?: GraphCacheResolver<WithTypename<CreateFilePayload>, Record<string, never>, WithTypename<File> | string>
  },
  CreateFilePermissionPayload?: {
    filePermission?: GraphCacheResolver<WithTypename<CreateFilePermissionPayload>, Record<string, never>, WithTypename<FilePermission> | string>
  },
  DeleteFilePayload?: {
    file?: GraphCacheResolver<WithTypename<DeleteFilePayload>, Record<string, never>, WithTypename<File> | string>
  },
  DeleteFilePermissionPayload?: {
    filePermission?: GraphCacheResolver<WithTypename<DeleteFilePermissionPayload>, Record<string, never>, WithTypename<FilePermission> | string>
  },
  Entry?: {
    body?: GraphCacheResolver<WithTypename<Entry>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<Entry>, Record<string, never>, Scalars['Time'] | string>,
    date?: GraphCacheResolver<WithTypename<Entry>, Record<string, never>, Scalars['String'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<Entry>, Record<string, never>, Scalars['Time'] | string>,
    events?: GraphCacheResolver<WithTypename<Entry>, Record<string, never>, Array<WithTypename<Event> | string>>,
    files?: GraphCacheResolver<WithTypename<Entry>, Record<string, never>, Array<WithTypename<File> | string>>,
    id?: GraphCacheResolver<WithTypename<Entry>, Record<string, never>, Scalars['ID'] | string>,
    subjects?: GraphCacheResolver<WithTypename<Entry>, Record<string, never>, Array<WithTypename<Competence> | string>>,
    tags?: GraphCacheResolver<WithTypename<Entry>, Record<string, never>, Array<WithTypename<Tag> | string>>,
    user?: GraphCacheResolver<WithTypename<Entry>, Record<string, never>, WithTypename<User> | string>,
    userCompetences?: GraphCacheResolver<WithTypename<Entry>, Record<string, never>, Array<WithTypename<UserCompetence> | string>>,
    users?: GraphCacheResolver<WithTypename<Entry>, Record<string, never>, Array<WithTypename<User> | string>>
  },
  EntryConnection?: {
    edges?: GraphCacheResolver<WithTypename<EntryConnection>, Record<string, never>, Array<WithTypename<Entry> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<EntryConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<EntryConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  Event?: {
    body?: GraphCacheResolver<WithTypename<Event>, Record<string, never>, Scalars['String'] | string>,
    competences?: GraphCacheResolver<WithTypename<Event>, Record<string, never>, Array<WithTypename<Competence> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<Event>, Record<string, never>, Scalars['Time'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<Event>, Record<string, never>, Scalars['Time'] | string>,
    endsAt?: GraphCacheResolver<WithTypename<Event>, Record<string, never>, Scalars['Time'] | string>,
    id?: GraphCacheResolver<WithTypename<Event>, Record<string, never>, Scalars['ID'] | string>,
    image?: GraphCacheResolver<WithTypename<Event>, Record<string, never>, WithTypename<File> | string>,
    recurrence?: GraphCacheResolver<WithTypename<Event>, Record<string, never>, Array<Scalars['String'] | string>>,
    startsAt?: GraphCacheResolver<WithTypename<Event>, Record<string, never>, Scalars['Time'] | string>,
    title?: GraphCacheResolver<WithTypename<Event>, Record<string, never>, Scalars['String'] | string>
  },
  EventConnection?: {
    edges?: GraphCacheResolver<WithTypename<EventConnection>, Record<string, never>, Array<WithTypename<Event> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<EventConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<EventConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  ExportEventsPayload?: {
    body?: GraphCacheResolver<WithTypename<ExportEventsPayload>, Record<string, never>, Scalars['String'] | string>,
    endsAt?: GraphCacheResolver<WithTypename<ExportEventsPayload>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<ExportEventsPayload>, Record<string, never>, Scalars['ID'] | string>,
    startsAt?: GraphCacheResolver<WithTypename<ExportEventsPayload>, Record<string, never>, Scalars['String'] | string>,
    subjects?: GraphCacheResolver<WithTypename<ExportEventsPayload>, Record<string, never>, Scalars['String'] | string>,
    title?: GraphCacheResolver<WithTypename<ExportEventsPayload>, Record<string, never>, Scalars['String'] | string>
  },
  File?: {
    children?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Array<WithTypename<File> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Scalars['Time'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Scalars['Time'] | string>,
    id?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Scalars['ID'] | string>,
    mime?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Scalars['String'] | string>,
    parent?: GraphCacheResolver<WithTypename<File>, Record<string, never>, WithTypename<File> | string>,
    parentsRecursive?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Array<WithTypename<File> | string>>,
    permissions?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Array<WithTypename<FilePermission> | string>>,
    size?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Scalars['Int'] | string>,
    type?: GraphCacheResolver<WithTypename<File>, Record<string, never>, FileType | string>
  },
  FileConnection?: {
    edges?: GraphCacheResolver<WithTypename<FileConnection>, Record<string, never>, Array<WithTypename<File> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<FileConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<FileConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  FilePermission?: {
    displayName?: GraphCacheResolver<WithTypename<FilePermission>, Record<string, never>, Scalars['String'] | string>,
    emailAddress?: GraphCacheResolver<WithTypename<FilePermission>, Record<string, never>, Scalars['String'] | string>,
    file?: GraphCacheResolver<WithTypename<FilePermission>, Record<string, never>, WithTypename<File> | string>,
    id?: GraphCacheResolver<WithTypename<FilePermission>, Record<string, never>, Scalars['ID'] | string>,
    inherited?: GraphCacheResolver<WithTypename<FilePermission>, Record<string, never>, Scalars['Boolean'] | string>,
    role?: GraphCacheResolver<WithTypename<FilePermission>, Record<string, never>, FilePermissionRole | string>,
    type?: GraphCacheResolver<WithTypename<FilePermission>, Record<string, never>, FilePermissionType | string>
  },
  ForgotPasswordPayload?: {
    success?: GraphCacheResolver<WithTypename<ForgotPasswordPayload>, Record<string, never>, Scalars['Boolean'] | string>
  },
  ImportStudentsPayload?: {
    errors?: GraphCacheResolver<WithTypename<ImportStudentsPayload>, Record<string, never>, Array<ImportStudentsError | string>>,
    usersCreated?: GraphCacheResolver<WithTypename<ImportStudentsPayload>, Record<string, never>, Scalars['Int'] | string>,
    usersExisted?: GraphCacheResolver<WithTypename<ImportStudentsPayload>, Record<string, never>, Scalars['Int'] | string>
  },
  InviteDetailsPayload?: {
    email?: GraphCacheResolver<WithTypename<InviteDetailsPayload>, Record<string, never>, Scalars['String'] | string>,
    firstName?: GraphCacheResolver<WithTypename<InviteDetailsPayload>, Record<string, never>, Scalars['String'] | string>,
    lastName?: GraphCacheResolver<WithTypename<InviteDetailsPayload>, Record<string, never>, Scalars['String'] | string>
  },
  Organisation?: {
    applications?: GraphCacheResolver<WithTypename<Organisation>, Record<string, never>, Array<OrganisationApplication | string>>,
    id?: GraphCacheResolver<WithTypename<Organisation>, Record<string, never>, Scalars['ID'] | string>,
    legalName?: GraphCacheResolver<WithTypename<Organisation>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<Organisation>, Record<string, never>, Scalars['String'] | string>,
    owner?: GraphCacheResolver<WithTypename<Organisation>, Record<string, never>, WithTypename<User> | string>,
    phone?: GraphCacheResolver<WithTypename<Organisation>, Record<string, never>, Scalars['String'] | string>,
    website?: GraphCacheResolver<WithTypename<Organisation>, Record<string, never>, Scalars['String'] | string>
  },
  PageInfo?: {
    currentPage?: GraphCacheResolver<WithTypename<PageInfo>, Record<string, never>, Scalars['Int'] | string>,
    hasNextPage?: GraphCacheResolver<WithTypename<PageInfo>, Record<string, never>, Scalars['Boolean'] | string>,
    hasPreviousPage?: GraphCacheResolver<WithTypename<PageInfo>, Record<string, never>, Scalars['Boolean'] | string>
  },
  Report?: {
    createdAt?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, Scalars['Time'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, Scalars['Time'] | string>,
    file?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, WithTypename<File> | string>,
    filterTags?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, Array<Scalars['ID'] | string>>,
    format?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, ReportFormat | string>,
    from?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, Scalars['Time'] | string>,
    id?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, Scalars['ID'] | string>,
    kind?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, ReportKind | string>,
    meta?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, Scalars['String'] | string>,
    status?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, ReportStatus | string>,
    studentUser?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, WithTypename<User> | string>,
    to?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, Scalars['Time'] | string>,
    user?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, WithTypename<User> | string>
  },
  ReportConnection?: {
    edges?: GraphCacheResolver<WithTypename<ReportConnection>, Record<string, never>, Array<WithTypename<Report> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<ReportConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<ReportConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  ResetPasswordPayload?: {
    organisation?: GraphCacheResolver<WithTypename<ResetPasswordPayload>, Record<string, never>, WithTypename<Organisation> | string>,
    token?: GraphCacheResolver<WithTypename<ResetPasswordPayload>, Record<string, never>, Scalars['String'] | string>,
    user?: GraphCacheResolver<WithTypename<ResetPasswordPayload>, Record<string, never>, WithTypename<User> | string>
  },
  SignInPayload?: {
    organisation?: GraphCacheResolver<WithTypename<SignInPayload>, Record<string, never>, WithTypename<Organisation> | string>,
    token?: GraphCacheResolver<WithTypename<SignInPayload>, Record<string, never>, Scalars['String'] | string>,
    user?: GraphCacheResolver<WithTypename<SignInPayload>, Record<string, never>, WithTypename<User> | string>
  },
  Tag?: {
    color?: GraphCacheResolver<WithTypename<Tag>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<Tag>, Record<string, never>, Scalars['Time'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<Tag>, Record<string, never>, Scalars['Time'] | string>,
    id?: GraphCacheResolver<WithTypename<Tag>, Record<string, never>, Scalars['ID'] | string>,
    name?: GraphCacheResolver<WithTypename<Tag>, Record<string, never>, Scalars['String'] | string>
  },
  TagConnection?: {
    edges?: GraphCacheResolver<WithTypename<TagConnection>, Record<string, never>, Array<WithTypename<Tag> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<TagConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<TagConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  UpdateFilePayload?: {
    file?: GraphCacheResolver<WithTypename<UpdateFilePayload>, Record<string, never>, WithTypename<File> | string>
  },
  UpdateFilePermissionPayload?: {
    filePermission?: GraphCacheResolver<WithTypename<UpdateFilePermissionPayload>, Record<string, never>, WithTypename<FilePermission> | string>
  },
  User?: {
    createdAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Time'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Time'] | string>,
    email?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    firstName?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['ID'] | string>,
    inviteAccepted?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Boolean'] | string>,
    language?: GraphCacheResolver<WithTypename<User>, Record<string, never>, UserLanguage | string>,
    lastName?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    lastSeenAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Time'] | string>,
    organisationId?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['ID'] | string>,
    role?: GraphCacheResolver<WithTypename<User>, Record<string, never>, UserRole | string>,
    student?: GraphCacheResolver<WithTypename<User>, Record<string, never>, WithTypename<UserStudent> | string>
  },
  UserAttendance?: {
    date?: GraphCacheResolver<WithTypename<UserAttendance>, Record<string, never>, Scalars['Time'] | string>,
    id?: GraphCacheResolver<WithTypename<UserAttendance>, Record<string, never>, Scalars['ID'] | string>,
    state?: GraphCacheResolver<WithTypename<UserAttendance>, Record<string, never>, UserAttendanceState | string>,
    user?: GraphCacheResolver<WithTypename<UserAttendance>, Record<string, never>, WithTypename<User> | string>
  },
  UserCompetence?: {
    competence?: GraphCacheResolver<WithTypename<UserCompetence>, Record<string, never>, WithTypename<Competence> | string>,
    createdAt?: GraphCacheResolver<WithTypename<UserCompetence>, Record<string, never>, Scalars['Time'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<UserCompetence>, Record<string, never>, WithTypename<User> | string>,
    entry?: GraphCacheResolver<WithTypename<UserCompetence>, Record<string, never>, WithTypename<Entry> | string>,
    id?: GraphCacheResolver<WithTypename<UserCompetence>, Record<string, never>, Scalars['ID'] | string>,
    level?: GraphCacheResolver<WithTypename<UserCompetence>, Record<string, never>, Scalars['Int'] | string>,
    user?: GraphCacheResolver<WithTypename<UserCompetence>, Record<string, never>, WithTypename<User> | string>
  },
  UserCompetenceConnection?: {
    edges?: GraphCacheResolver<WithTypename<UserCompetenceConnection>, Record<string, never>, Array<WithTypename<UserCompetence> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<UserCompetenceConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<UserCompetenceConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  UserConnection?: {
    edges?: GraphCacheResolver<WithTypename<UserConnection>, Record<string, never>, Array<WithTypename<User> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<UserConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<UserConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  UserStudent?: {
    birthday?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['Time'] | string>,
    comments?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['String'] | string>,
    competencesCount?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['Int'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['Time'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['Time'] | string>,
    emoji?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['String'] | string>,
    entriesCount?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['Int'] | string>,
    eventsCount?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['Int'] | string>,
    grade?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['ID'] | string>,
    joinedAt?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['Time'] | string>,
    leftAt?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['Time'] | string>,
    missedHours?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['Int'] | string>,
    missedHoursExcused?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['Int'] | string>,
    nationality?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['String'] | string>,
    user?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, WithTypename<User> | string>
  },
  UserStudentConnection?: {
    edges?: GraphCacheResolver<WithTypename<UserStudentConnection>, Record<string, never>, Array<WithTypename<UserStudent> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<UserStudentConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<UserStudentConnection>, Record<string, never>, Scalars['Int'] | string>
  }
};

export type GraphCacheOptimisticUpdaters = {
  acceptInvite?: GraphCacheOptimisticMutationResolver<MutationAcceptInviteArgs, WithTypename<SignInPayload>>,
  addUserToChat?: GraphCacheOptimisticMutationResolver<MutationAddUserToChatArgs, WithTypename<ChatUser>>,
  archiveEntry?: GraphCacheOptimisticMutationResolver<MutationArchiveEntryArgs, WithTypename<Entry>>,
  archiveEvent?: GraphCacheOptimisticMutationResolver<MutationArchiveEventArgs, WithTypename<Event>>,
  archiveTag?: GraphCacheOptimisticMutationResolver<MutationArchiveTagArgs, WithTypename<Tag>>,
  archiveUser?: GraphCacheOptimisticMutationResolver<MutationArchiveUserArgs, WithTypename<User>>,
  archiveUserCompetence?: GraphCacheOptimisticMutationResolver<MutationArchiveUserCompetenceArgs, WithTypename<UserCompetence>>,
  createChat?: GraphCacheOptimisticMutationResolver<MutationCreateChatArgs, WithTypename<Chat>>,
  createCompetence?: GraphCacheOptimisticMutationResolver<MutationCreateCompetenceArgs, WithTypename<Competence>>,
  createEntry?: GraphCacheOptimisticMutationResolver<Record<string, never>, WithTypename<Entry>>,
  createEntryCompetence?: GraphCacheOptimisticMutationResolver<MutationCreateEntryCompetenceArgs, WithTypename<Entry>>,
  createEntryEvent?: GraphCacheOptimisticMutationResolver<MutationCreateEntryEventArgs, WithTypename<Entry>>,
  createEntryFile?: GraphCacheOptimisticMutationResolver<MutationCreateEntryFileArgs, WithTypename<Entry>>,
  createEntryTag?: GraphCacheOptimisticMutationResolver<MutationCreateEntryTagArgs, WithTypename<Entry>>,
  createEntryUser?: GraphCacheOptimisticMutationResolver<MutationCreateEntryUserArgs, WithTypename<Entry>>,
  createEvent?: GraphCacheOptimisticMutationResolver<MutationCreateEventArgs, WithTypename<Event>>,
  createFile?: GraphCacheOptimisticMutationResolver<MutationCreateFileArgs, WithTypename<CreateFilePayload>>,
  createFilePermission?: GraphCacheOptimisticMutationResolver<MutationCreateFilePermissionArgs, WithTypename<CreateFilePermissionPayload>>,
  createPrivatChat?: GraphCacheOptimisticMutationResolver<MutationCreatePrivatChatArgs, WithTypename<Chat>>,
  createReport?: GraphCacheOptimisticMutationResolver<MutationCreateReportArgs, Array<WithTypename<Report>>>,
  createStudent?: GraphCacheOptimisticMutationResolver<MutationCreateStudentArgs, WithTypename<User>>,
  createTag?: GraphCacheOptimisticMutationResolver<MutationCreateTagArgs, WithTypename<Tag>>,
  createUser?: GraphCacheOptimisticMutationResolver<MutationCreateUserArgs, WithTypename<User>>,
  createUserCompetence?: GraphCacheOptimisticMutationResolver<MutationCreateUserCompetenceArgs, WithTypename<UserCompetence>>,
  deleteChat?: GraphCacheOptimisticMutationResolver<MutationDeleteChatArgs, WithTypename<Chat>>,
  deleteEntryCompetence?: GraphCacheOptimisticMutationResolver<MutationDeleteEntryCompetenceArgs, WithTypename<Entry>>,
  deleteEntryEvent?: GraphCacheOptimisticMutationResolver<MutationDeleteEntryEventArgs, WithTypename<Entry>>,
  deleteEntryFile?: GraphCacheOptimisticMutationResolver<MutationDeleteEntryFileArgs, WithTypename<Entry>>,
  deleteEntryTag?: GraphCacheOptimisticMutationResolver<MutationDeleteEntryTagArgs, WithTypename<Entry>>,
  deleteEntryUser?: GraphCacheOptimisticMutationResolver<MutationDeleteEntryUserArgs, WithTypename<Entry>>,
  deleteFile?: GraphCacheOptimisticMutationResolver<MutationDeleteFileArgs, WithTypename<DeleteFilePayload>>,
  deleteFilePermission?: GraphCacheOptimisticMutationResolver<MutationDeleteFilePermissionArgs, WithTypename<DeleteFilePermissionPayload>>,
  editChatMessage?: GraphCacheOptimisticMutationResolver<MutationEditChatMessageArgs, WithTypename<ChatMessage>>,
  forgotPassword?: GraphCacheOptimisticMutationResolver<MutationForgotPasswordArgs, Scalars['Boolean']>,
  importStudents?: GraphCacheOptimisticMutationResolver<MutationImportStudentsArgs, WithTypename<ImportStudentsPayload>>,
  markMessageAsRead?: GraphCacheOptimisticMutationResolver<MutationMarkMessageAsReadArgs, WithTypename<ChatMessage>>,
  removeFileFromEntry?: GraphCacheOptimisticMutationResolver<MutationRemoveFileFromEntryArgs, WithTypename<File>>,
  removeUserFromChat?: GraphCacheOptimisticMutationResolver<MutationRemoveUserFromChatArgs, WithTypename<ChatUser>>,
  resetPassword?: GraphCacheOptimisticMutationResolver<MutationResetPasswordArgs, WithTypename<ResetPasswordPayload>>,
  sendMessage?: GraphCacheOptimisticMutationResolver<MutationSendMessageArgs, WithTypename<ChatMessage>>,
  sendUserInvite?: GraphCacheOptimisticMutationResolver<MutationSendUserInviteArgs, Scalars['Boolean']>,
  signIn?: GraphCacheOptimisticMutationResolver<MutationSignInArgs, WithTypename<SignInPayload>>,
  signOut?: GraphCacheOptimisticMutationResolver<Record<string, never>, Scalars['Boolean']>,
  toggleEventCompetence?: GraphCacheOptimisticMutationResolver<MutationToggleEventCompetenceArgs, WithTypename<Event>>,
  updateChat?: GraphCacheOptimisticMutationResolver<MutationUpdateChatArgs, WithTypename<Chat>>,
  updateCompetence?: GraphCacheOptimisticMutationResolver<MutationUpdateCompetenceArgs, WithTypename<Competence>>,
  updateCompetenceSorting?: GraphCacheOptimisticMutationResolver<MutationUpdateCompetenceSortingArgs, Array<WithTypename<Competence>>>,
  updateEntry?: GraphCacheOptimisticMutationResolver<MutationUpdateEntryArgs, WithTypename<Entry>>,
  updateEntryUserCompetenceLevel?: GraphCacheOptimisticMutationResolver<MutationUpdateEntryUserCompetenceLevelArgs, WithTypename<Entry>>,
  updateEvent?: GraphCacheOptimisticMutationResolver<MutationUpdateEventArgs, WithTypename<Event>>,
  updateFile?: GraphCacheOptimisticMutationResolver<MutationUpdateFileArgs, WithTypename<UpdateFilePayload>>,
  updateFilePermission?: GraphCacheOptimisticMutationResolver<MutationUpdateFilePermissionArgs, WithTypename<UpdateFilePermissionPayload>>,
  updateOrganisation?: GraphCacheOptimisticMutationResolver<MutationUpdateOrganisationArgs, WithTypename<Organisation>>,
  updatePassword?: GraphCacheOptimisticMutationResolver<MutationUpdatePasswordArgs, Scalars['Boolean']>,
  updateTag?: GraphCacheOptimisticMutationResolver<MutationUpdateTagArgs, WithTypename<Tag>>,
  updateUser?: GraphCacheOptimisticMutationResolver<MutationUpdateUserArgs, WithTypename<User>>,
  updateUserAttendance?: GraphCacheOptimisticMutationResolver<MutationUpdateUserAttendanceArgs, WithTypename<UserAttendance>>,
  updateUserLanguage?: GraphCacheOptimisticMutationResolver<MutationUpdateUserLanguageArgs, WithTypename<User>>,
  uploadFileToEntry?: GraphCacheOptimisticMutationResolver<MutationUploadFileToEntryArgs, WithTypename<Entry>>
};

export type GraphCacheUpdaters = {
  Query?: {
    chat?: GraphCacheUpdateResolver<{ chat: WithTypename<Chat> }, QueryChatArgs>,
    chats?: GraphCacheUpdateResolver<{ chats: WithTypename<ChatConnection> }, QueryChatsArgs>,
    competence?: GraphCacheUpdateResolver<{ competence: WithTypename<Competence> }, QueryCompetenceArgs>,
    competences?: GraphCacheUpdateResolver<{ competences: WithTypename<CompetenceConnection> }, QueryCompetencesArgs>,
    entries?: GraphCacheUpdateResolver<{ entries: WithTypename<EntryConnection> }, QueryEntriesArgs>,
    entry?: GraphCacheUpdateResolver<{ entry: WithTypename<Entry> }, QueryEntryArgs>,
    event?: GraphCacheUpdateResolver<{ event: WithTypename<Event> }, QueryEventArgs>,
    events?: GraphCacheUpdateResolver<{ events: WithTypename<EventConnection> }, QueryEventsArgs>,
    exportEvents?: GraphCacheUpdateResolver<{ exportEvents: Array<WithTypename<ExportEventsPayload>> }, QueryExportEventsArgs>,
    file?: GraphCacheUpdateResolver<{ file: WithTypename<File> }, QueryFileArgs>,
    files?: GraphCacheUpdateResolver<{ files: WithTypename<FileConnection> }, QueryFilesArgs>,
    inviteDetails?: GraphCacheUpdateResolver<{ inviteDetails: WithTypename<InviteDetailsPayload> }, QueryInviteDetailsArgs>,
    me?: GraphCacheUpdateResolver<{ me: WithTypename<User> }, Record<string, never>>,
    myDrive?: GraphCacheUpdateResolver<{ myDrive: WithTypename<FileConnection> }, QueryMyDriveArgs>,
    organisation?: GraphCacheUpdateResolver<{ organisation: Maybe<WithTypename<Organisation>> }, Record<string, never>>,
    report?: GraphCacheUpdateResolver<{ report: WithTypename<Report> }, QueryReportArgs>,
    reports?: GraphCacheUpdateResolver<{ reports: WithTypename<ReportConnection> }, QueryReportsArgs>,
    sharedDrives?: GraphCacheUpdateResolver<{ sharedDrives: WithTypename<FileConnection> }, QuerySharedDrivesArgs>,
    tag?: GraphCacheUpdateResolver<{ tag: WithTypename<Tag> }, QueryTagArgs>,
    tags?: GraphCacheUpdateResolver<{ tags: WithTypename<TagConnection> }, QueryTagsArgs>,
    trash?: GraphCacheUpdateResolver<{ trash: WithTypename<FileConnection> }, QueryTrashArgs>,
    user?: GraphCacheUpdateResolver<{ user: WithTypename<User> }, QueryUserArgs>,
    userAttendances?: GraphCacheUpdateResolver<{ userAttendances: Array<WithTypename<UserAttendance>> }, QueryUserAttendancesArgs>,
    userStudent?: GraphCacheUpdateResolver<{ userStudent: WithTypename<UserStudent> }, QueryUserStudentArgs>,
    userStudents?: GraphCacheUpdateResolver<{ userStudents: WithTypename<UserStudentConnection> }, QueryUserStudentsArgs>,
    users?: GraphCacheUpdateResolver<{ users: WithTypename<UserConnection> }, QueryUsersArgs>
  },
  Mutation?: {
    acceptInvite?: GraphCacheUpdateResolver<{ acceptInvite: WithTypename<SignInPayload> }, MutationAcceptInviteArgs>,
    addUserToChat?: GraphCacheUpdateResolver<{ addUserToChat: WithTypename<ChatUser> }, MutationAddUserToChatArgs>,
    archiveEntry?: GraphCacheUpdateResolver<{ archiveEntry: WithTypename<Entry> }, MutationArchiveEntryArgs>,
    archiveEvent?: GraphCacheUpdateResolver<{ archiveEvent: WithTypename<Event> }, MutationArchiveEventArgs>,
    archiveTag?: GraphCacheUpdateResolver<{ archiveTag: WithTypename<Tag> }, MutationArchiveTagArgs>,
    archiveUser?: GraphCacheUpdateResolver<{ archiveUser: WithTypename<User> }, MutationArchiveUserArgs>,
    archiveUserCompetence?: GraphCacheUpdateResolver<{ archiveUserCompetence: WithTypename<UserCompetence> }, MutationArchiveUserCompetenceArgs>,
    createChat?: GraphCacheUpdateResolver<{ createChat: WithTypename<Chat> }, MutationCreateChatArgs>,
    createCompetence?: GraphCacheUpdateResolver<{ createCompetence: WithTypename<Competence> }, MutationCreateCompetenceArgs>,
    createEntry?: GraphCacheUpdateResolver<{ createEntry: WithTypename<Entry> }, Record<string, never>>,
    createEntryCompetence?: GraphCacheUpdateResolver<{ createEntryCompetence: WithTypename<Entry> }, MutationCreateEntryCompetenceArgs>,
    createEntryEvent?: GraphCacheUpdateResolver<{ createEntryEvent: WithTypename<Entry> }, MutationCreateEntryEventArgs>,
    createEntryFile?: GraphCacheUpdateResolver<{ createEntryFile: WithTypename<Entry> }, MutationCreateEntryFileArgs>,
    createEntryTag?: GraphCacheUpdateResolver<{ createEntryTag: WithTypename<Entry> }, MutationCreateEntryTagArgs>,
    createEntryUser?: GraphCacheUpdateResolver<{ createEntryUser: WithTypename<Entry> }, MutationCreateEntryUserArgs>,
    createEvent?: GraphCacheUpdateResolver<{ createEvent: WithTypename<Event> }, MutationCreateEventArgs>,
    createFile?: GraphCacheUpdateResolver<{ createFile: WithTypename<CreateFilePayload> }, MutationCreateFileArgs>,
    createFilePermission?: GraphCacheUpdateResolver<{ createFilePermission: WithTypename<CreateFilePermissionPayload> }, MutationCreateFilePermissionArgs>,
    createPrivatChat?: GraphCacheUpdateResolver<{ createPrivatChat: WithTypename<Chat> }, MutationCreatePrivatChatArgs>,
    createReport?: GraphCacheUpdateResolver<{ createReport: Array<WithTypename<Report>> }, MutationCreateReportArgs>,
    createStudent?: GraphCacheUpdateResolver<{ createStudent: WithTypename<User> }, MutationCreateStudentArgs>,
    createTag?: GraphCacheUpdateResolver<{ createTag: WithTypename<Tag> }, MutationCreateTagArgs>,
    createUser?: GraphCacheUpdateResolver<{ createUser: WithTypename<User> }, MutationCreateUserArgs>,
    createUserCompetence?: GraphCacheUpdateResolver<{ createUserCompetence: WithTypename<UserCompetence> }, MutationCreateUserCompetenceArgs>,
    deleteChat?: GraphCacheUpdateResolver<{ deleteChat: WithTypename<Chat> }, MutationDeleteChatArgs>,
    deleteEntryCompetence?: GraphCacheUpdateResolver<{ deleteEntryCompetence: WithTypename<Entry> }, MutationDeleteEntryCompetenceArgs>,
    deleteEntryEvent?: GraphCacheUpdateResolver<{ deleteEntryEvent: WithTypename<Entry> }, MutationDeleteEntryEventArgs>,
    deleteEntryFile?: GraphCacheUpdateResolver<{ deleteEntryFile: WithTypename<Entry> }, MutationDeleteEntryFileArgs>,
    deleteEntryTag?: GraphCacheUpdateResolver<{ deleteEntryTag: WithTypename<Entry> }, MutationDeleteEntryTagArgs>,
    deleteEntryUser?: GraphCacheUpdateResolver<{ deleteEntryUser: WithTypename<Entry> }, MutationDeleteEntryUserArgs>,
    deleteFile?: GraphCacheUpdateResolver<{ deleteFile: WithTypename<DeleteFilePayload> }, MutationDeleteFileArgs>,
    deleteFilePermission?: GraphCacheUpdateResolver<{ deleteFilePermission: WithTypename<DeleteFilePermissionPayload> }, MutationDeleteFilePermissionArgs>,
    editChatMessage?: GraphCacheUpdateResolver<{ editChatMessage: WithTypename<ChatMessage> }, MutationEditChatMessageArgs>,
    forgotPassword?: GraphCacheUpdateResolver<{ forgotPassword: Scalars['Boolean'] }, MutationForgotPasswordArgs>,
    importStudents?: GraphCacheUpdateResolver<{ importStudents: WithTypename<ImportStudentsPayload> }, MutationImportStudentsArgs>,
    markMessageAsRead?: GraphCacheUpdateResolver<{ markMessageAsRead: WithTypename<ChatMessage> }, MutationMarkMessageAsReadArgs>,
    removeFileFromEntry?: GraphCacheUpdateResolver<{ removeFileFromEntry: WithTypename<File> }, MutationRemoveFileFromEntryArgs>,
    removeUserFromChat?: GraphCacheUpdateResolver<{ removeUserFromChat: WithTypename<ChatUser> }, MutationRemoveUserFromChatArgs>,
    resetPassword?: GraphCacheUpdateResolver<{ resetPassword: WithTypename<ResetPasswordPayload> }, MutationResetPasswordArgs>,
    sendMessage?: GraphCacheUpdateResolver<{ sendMessage: WithTypename<ChatMessage> }, MutationSendMessageArgs>,
    sendUserInvite?: GraphCacheUpdateResolver<{ sendUserInvite: Scalars['Boolean'] }, MutationSendUserInviteArgs>,
    signIn?: GraphCacheUpdateResolver<{ signIn: WithTypename<SignInPayload> }, MutationSignInArgs>,
    signOut?: GraphCacheUpdateResolver<{ signOut: Scalars['Boolean'] }, Record<string, never>>,
    toggleEventCompetence?: GraphCacheUpdateResolver<{ toggleEventCompetence: WithTypename<Event> }, MutationToggleEventCompetenceArgs>,
    updateChat?: GraphCacheUpdateResolver<{ updateChat: WithTypename<Chat> }, MutationUpdateChatArgs>,
    updateCompetence?: GraphCacheUpdateResolver<{ updateCompetence: WithTypename<Competence> }, MutationUpdateCompetenceArgs>,
    updateCompetenceSorting?: GraphCacheUpdateResolver<{ updateCompetenceSorting: Array<WithTypename<Competence>> }, MutationUpdateCompetenceSortingArgs>,
    updateEntry?: GraphCacheUpdateResolver<{ updateEntry: WithTypename<Entry> }, MutationUpdateEntryArgs>,
    updateEntryUserCompetenceLevel?: GraphCacheUpdateResolver<{ updateEntryUserCompetenceLevel: WithTypename<Entry> }, MutationUpdateEntryUserCompetenceLevelArgs>,
    updateEvent?: GraphCacheUpdateResolver<{ updateEvent: WithTypename<Event> }, MutationUpdateEventArgs>,
    updateFile?: GraphCacheUpdateResolver<{ updateFile: WithTypename<UpdateFilePayload> }, MutationUpdateFileArgs>,
    updateFilePermission?: GraphCacheUpdateResolver<{ updateFilePermission: WithTypename<UpdateFilePermissionPayload> }, MutationUpdateFilePermissionArgs>,
    updateOrganisation?: GraphCacheUpdateResolver<{ updateOrganisation: WithTypename<Organisation> }, MutationUpdateOrganisationArgs>,
    updatePassword?: GraphCacheUpdateResolver<{ updatePassword: Scalars['Boolean'] }, MutationUpdatePasswordArgs>,
    updateTag?: GraphCacheUpdateResolver<{ updateTag: WithTypename<Tag> }, MutationUpdateTagArgs>,
    updateUser?: GraphCacheUpdateResolver<{ updateUser: WithTypename<User> }, MutationUpdateUserArgs>,
    updateUserAttendance?: GraphCacheUpdateResolver<{ updateUserAttendance: WithTypename<UserAttendance> }, MutationUpdateUserAttendanceArgs>,
    updateUserLanguage?: GraphCacheUpdateResolver<{ updateUserLanguage: WithTypename<User> }, MutationUpdateUserLanguageArgs>,
    uploadFileToEntry?: GraphCacheUpdateResolver<{ uploadFileToEntry: WithTypename<Entry> }, MutationUploadFileToEntryArgs>
  },
  Subscription?: {
    messageAdded?: GraphCacheUpdateResolver<{ messageAdded: WithTypename<ChatMessage> }, Record<string, never>>,
    reportCreatedOrUpdated?: GraphCacheUpdateResolver<{ reportCreatedOrUpdated: WithTypename<Report> }, Record<string, never>>
  },
  Chat?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    deleted?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    lastMessage?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    messages?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    type?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    unreadMessageCount?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    userCount?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    users?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>
  },
  ChatConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatConnection>>, Record<string, never>>
  },
  ChatMessage?: {
    chat?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatMessage>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatMessage>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatMessage>>, Record<string, never>>,
    isEdited?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatMessage>>, Record<string, never>>,
    isSeen?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatMessage>>, Record<string, never>>,
    message?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatMessage>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatMessage>>, Record<string, never>>
  },
  ChatUser?: {
    chat?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatUser>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatUser>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatUser>>, Record<string, never>>
  },
  Competence?: {
    color?: GraphCacheUpdateResolver<Maybe<WithTypename<Competence>>, Record<string, never>>,
    competences?: GraphCacheUpdateResolver<Maybe<WithTypename<Competence>>, CompetenceCompetencesArgs>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Competence>>, Record<string, never>>,
    grades?: GraphCacheUpdateResolver<Maybe<WithTypename<Competence>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Competence>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<Competence>>, Record<string, never>>,
    parents?: GraphCacheUpdateResolver<Maybe<WithTypename<Competence>>, Record<string, never>>,
    sortOrder?: GraphCacheUpdateResolver<Maybe<WithTypename<Competence>>, Record<string, never>>,
    tendency?: GraphCacheUpdateResolver<Maybe<WithTypename<Competence>>, CompetenceTendencyArgs>,
    type?: GraphCacheUpdateResolver<Maybe<WithTypename<Competence>>, Record<string, never>>,
    userCompetences?: GraphCacheUpdateResolver<Maybe<WithTypename<Competence>>, CompetenceUserCompetencesArgs>
  },
  CompetenceConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<CompetenceConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<CompetenceConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<CompetenceConnection>>, Record<string, never>>
  },
  CompetenceTendency?: {
    countChildCompetences?: GraphCacheUpdateResolver<Maybe<WithTypename<CompetenceTendency>>, Record<string, never>>,
    countLearnedCompetences?: GraphCacheUpdateResolver<Maybe<WithTypename<CompetenceTendency>>, Record<string, never>>,
    tendency?: GraphCacheUpdateResolver<Maybe<WithTypename<CompetenceTendency>>, Record<string, never>>
  },
  CreateFilePayload?: {
    file?: GraphCacheUpdateResolver<Maybe<WithTypename<CreateFilePayload>>, Record<string, never>>
  },
  CreateFilePermissionPayload?: {
    filePermission?: GraphCacheUpdateResolver<Maybe<WithTypename<CreateFilePermissionPayload>>, Record<string, never>>
  },
  DeleteFilePayload?: {
    file?: GraphCacheUpdateResolver<Maybe<WithTypename<DeleteFilePayload>>, Record<string, never>>
  },
  DeleteFilePermissionPayload?: {
    filePermission?: GraphCacheUpdateResolver<Maybe<WithTypename<DeleteFilePermissionPayload>>, Record<string, never>>
  },
  Entry?: {
    body?: GraphCacheUpdateResolver<Maybe<WithTypename<Entry>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Entry>>, Record<string, never>>,
    date?: GraphCacheUpdateResolver<Maybe<WithTypename<Entry>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Entry>>, Record<string, never>>,
    events?: GraphCacheUpdateResolver<Maybe<WithTypename<Entry>>, Record<string, never>>,
    files?: GraphCacheUpdateResolver<Maybe<WithTypename<Entry>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Entry>>, Record<string, never>>,
    subjects?: GraphCacheUpdateResolver<Maybe<WithTypename<Entry>>, Record<string, never>>,
    tags?: GraphCacheUpdateResolver<Maybe<WithTypename<Entry>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<Entry>>, Record<string, never>>,
    userCompetences?: GraphCacheUpdateResolver<Maybe<WithTypename<Entry>>, Record<string, never>>,
    users?: GraphCacheUpdateResolver<Maybe<WithTypename<Entry>>, Record<string, never>>
  },
  EntryConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<EntryConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<EntryConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<EntryConnection>>, Record<string, never>>
  },
  Event?: {
    body?: GraphCacheUpdateResolver<Maybe<WithTypename<Event>>, Record<string, never>>,
    competences?: GraphCacheUpdateResolver<Maybe<WithTypename<Event>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Event>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Event>>, Record<string, never>>,
    endsAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Event>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Event>>, Record<string, never>>,
    image?: GraphCacheUpdateResolver<Maybe<WithTypename<Event>>, Record<string, never>>,
    recurrence?: GraphCacheUpdateResolver<Maybe<WithTypename<Event>>, Record<string, never>>,
    startsAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Event>>, Record<string, never>>,
    title?: GraphCacheUpdateResolver<Maybe<WithTypename<Event>>, Record<string, never>>
  },
  EventConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<EventConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<EventConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<EventConnection>>, Record<string, never>>
  },
  ExportEventsPayload?: {
    body?: GraphCacheUpdateResolver<Maybe<WithTypename<ExportEventsPayload>>, Record<string, never>>,
    endsAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ExportEventsPayload>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<ExportEventsPayload>>, Record<string, never>>,
    startsAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ExportEventsPayload>>, Record<string, never>>,
    subjects?: GraphCacheUpdateResolver<Maybe<WithTypename<ExportEventsPayload>>, Record<string, never>>,
    title?: GraphCacheUpdateResolver<Maybe<WithTypename<ExportEventsPayload>>, Record<string, never>>
  },
  File?: {
    children?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    mime?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    parent?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    parentsRecursive?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    permissions?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    size?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    type?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>
  },
  FileConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<FileConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<FileConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<FileConnection>>, Record<string, never>>
  },
  FilePermission?: {
    displayName?: GraphCacheUpdateResolver<Maybe<WithTypename<FilePermission>>, Record<string, never>>,
    emailAddress?: GraphCacheUpdateResolver<Maybe<WithTypename<FilePermission>>, Record<string, never>>,
    file?: GraphCacheUpdateResolver<Maybe<WithTypename<FilePermission>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<FilePermission>>, Record<string, never>>,
    inherited?: GraphCacheUpdateResolver<Maybe<WithTypename<FilePermission>>, Record<string, never>>,
    role?: GraphCacheUpdateResolver<Maybe<WithTypename<FilePermission>>, Record<string, never>>,
    type?: GraphCacheUpdateResolver<Maybe<WithTypename<FilePermission>>, Record<string, never>>
  },
  ForgotPasswordPayload?: {
    success?: GraphCacheUpdateResolver<Maybe<WithTypename<ForgotPasswordPayload>>, Record<string, never>>
  },
  ImportStudentsPayload?: {
    errors?: GraphCacheUpdateResolver<Maybe<WithTypename<ImportStudentsPayload>>, Record<string, never>>,
    usersCreated?: GraphCacheUpdateResolver<Maybe<WithTypename<ImportStudentsPayload>>, Record<string, never>>,
    usersExisted?: GraphCacheUpdateResolver<Maybe<WithTypename<ImportStudentsPayload>>, Record<string, never>>
  },
  InviteDetailsPayload?: {
    email?: GraphCacheUpdateResolver<Maybe<WithTypename<InviteDetailsPayload>>, Record<string, never>>,
    firstName?: GraphCacheUpdateResolver<Maybe<WithTypename<InviteDetailsPayload>>, Record<string, never>>,
    lastName?: GraphCacheUpdateResolver<Maybe<WithTypename<InviteDetailsPayload>>, Record<string, never>>
  },
  Organisation?: {
    applications?: GraphCacheUpdateResolver<Maybe<WithTypename<Organisation>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Organisation>>, Record<string, never>>,
    legalName?: GraphCacheUpdateResolver<Maybe<WithTypename<Organisation>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<Organisation>>, Record<string, never>>,
    owner?: GraphCacheUpdateResolver<Maybe<WithTypename<Organisation>>, Record<string, never>>,
    phone?: GraphCacheUpdateResolver<Maybe<WithTypename<Organisation>>, Record<string, never>>,
    website?: GraphCacheUpdateResolver<Maybe<WithTypename<Organisation>>, Record<string, never>>
  },
  PageInfo?: {
    currentPage?: GraphCacheUpdateResolver<Maybe<WithTypename<PageInfo>>, Record<string, never>>,
    hasNextPage?: GraphCacheUpdateResolver<Maybe<WithTypename<PageInfo>>, Record<string, never>>,
    hasPreviousPage?: GraphCacheUpdateResolver<Maybe<WithTypename<PageInfo>>, Record<string, never>>
  },
  Report?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>,
    file?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>,
    filterTags?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>,
    format?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>,
    from?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>,
    kind?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>,
    meta?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>,
    status?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>,
    studentUser?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>,
    to?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<Report>>, Record<string, never>>
  },
  ReportConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportConnection>>, Record<string, never>>
  },
  ResetPasswordPayload?: {
    organisation?: GraphCacheUpdateResolver<Maybe<WithTypename<ResetPasswordPayload>>, Record<string, never>>,
    token?: GraphCacheUpdateResolver<Maybe<WithTypename<ResetPasswordPayload>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<ResetPasswordPayload>>, Record<string, never>>
  },
  SignInPayload?: {
    organisation?: GraphCacheUpdateResolver<Maybe<WithTypename<SignInPayload>>, Record<string, never>>,
    token?: GraphCacheUpdateResolver<Maybe<WithTypename<SignInPayload>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<SignInPayload>>, Record<string, never>>
  },
  Tag?: {
    color?: GraphCacheUpdateResolver<Maybe<WithTypename<Tag>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Tag>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Tag>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Tag>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<Tag>>, Record<string, never>>
  },
  TagConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<TagConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<TagConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<TagConnection>>, Record<string, never>>
  },
  UpdateFilePayload?: {
    file?: GraphCacheUpdateResolver<Maybe<WithTypename<UpdateFilePayload>>, Record<string, never>>
  },
  UpdateFilePermissionPayload?: {
    filePermission?: GraphCacheUpdateResolver<Maybe<WithTypename<UpdateFilePermissionPayload>>, Record<string, never>>
  },
  User?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    email?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    firstName?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    inviteAccepted?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    language?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    lastName?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    lastSeenAt?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    organisationId?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    role?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    student?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>
  },
  UserAttendance?: {
    date?: GraphCacheUpdateResolver<Maybe<WithTypename<UserAttendance>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<UserAttendance>>, Record<string, never>>,
    state?: GraphCacheUpdateResolver<Maybe<WithTypename<UserAttendance>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<UserAttendance>>, Record<string, never>>
  },
  UserCompetence?: {
    competence?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCompetence>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCompetence>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCompetence>>, Record<string, never>>,
    entry?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCompetence>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCompetence>>, Record<string, never>>,
    level?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCompetence>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCompetence>>, Record<string, never>>
  },
  UserCompetenceConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCompetenceConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCompetenceConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCompetenceConnection>>, Record<string, never>>
  },
  UserConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<UserConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<UserConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<UserConnection>>, Record<string, never>>
  },
  UserStudent?: {
    birthday?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    comments?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    competencesCount?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    emoji?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    entriesCount?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    eventsCount?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    grade?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    joinedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    leftAt?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    missedHours?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    missedHoursExcused?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    nationality?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>
  },
  UserStudentConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentConnection>>, Record<string, never>>
  },
};

export type GraphCacheConfig = Parameters<typeof cacheExchange>[0] & {
  updates?: GraphCacheUpdaters,
  keys?: GraphCacheKeysConfig,
  optimistic?: GraphCacheOptimisticUpdaters,
  resolvers?: GraphCacheResolvers,
};
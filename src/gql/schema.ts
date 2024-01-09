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

export type Bucket = {
  __typename?: 'Bucket';
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  files: Array<File>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permission?: Maybe<FilePermission>;
  shared: Scalars['Boolean']['output'];
  user: User;
};

export type BucketConnection = {
  __typename?: 'BucketConnection';
  edges: Array<Bucket>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BucketFilterInput = {
  shared?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Chat = {
  __typename?: 'Chat';
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  id: Scalars['ID']['output'];
  lastMessage?: Maybe<Scalars['String']['output']>;
  messages: Array<ChatMessage>;
  name?: Maybe<Scalars['String']['output']>;
  type: ChatType;
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

export enum ChatType {
  Channel = 'CHANNEL',
  Group = 'GROUP',
  Private = 'PRIVATE'
}

export type ChatUser = {
  __typename?: 'ChatUser';
  chat: Chat;
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
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

export type CopyFileInput = {
  id: Scalars['ID']['input'];
  targetId: Scalars['ID']['input'];
};

export type CopyFilesInput = {
  ids: Array<Scalars['ID']['input']>;
  targetId: Scalars['ID']['input'];
};

export type CopyFilesPayload = {
  __typename?: 'CopyFilesPayload';
  files: Array<File>;
};

export type CreateChatInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCompetenceInput = {
  name: Scalars['String']['input'];
  parentId: Scalars['ID']['input'];
};

export type CreateDomainInput = {
  name: Scalars['String']['input'];
};

export type CreateEmailAccountInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  quota?: InputMaybe<Scalars['Int']['input']>;
  type: EmailAccountType;
};

export type CreateEmailForwardingInput = {
  origin: Scalars['String']['input'];
  target: Scalars['String']['input'];
};

export type CreateEmailGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  members?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name: Scalars['String']['input'];
};

export type CreateEmailGroupMemberInput = {
  memberOf: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateEmailInput = {
  address: Scalars['String']['input'];
  name: Scalars['String']['input'];
  type: EmailType;
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

export type CreateFolderInput = {
  bucketId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateReportInput = {
  filterTags: Array<Scalars['ID']['input']>;
  format: ReportFormat;
  from: Scalars['Time']['input'];
  kind: ReportKind;
  studentUser: Scalars['ID']['input'];
  to: Scalars['Time']['input'];
};

export type CreateSchoolYearInput = {
  year: Scalars['Int']['input'];
};

export type CreateShareInput = {
  bucketId?: InputMaybe<Scalars['ID']['input']>;
  fileId?: InputMaybe<Scalars['ID']['input']>;
  permission: FilePermission;
  user: Scalars['ID']['input'];
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

export type CreateSubjectInput = {
  name: Scalars['String']['input'];
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

export type CreateUserStudentGradesInput = {
  grade: Scalars['Int']['input'];
  schoolYear: Scalars['ID']['input'];
  student: Scalars['ID']['input'];
  subject: Scalars['ID']['input'];
};

export type DeleteChatInput = {
  id: Scalars['ID']['input'];
};

export type DeleteDomainInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEmailAccountInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEmailForwardingInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEmailGroupMemberInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEmailInput = {
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
  success: Scalars['Boolean']['output'];
};

export type DeleteFilesInput = {
  ids: Array<Scalars['ID']['input']>;
};

export type DeleteFilesPayload = {
  __typename?: 'DeleteFilesPayload';
  files: Array<File>;
  success: Scalars['Boolean']['output'];
};

export type DeleteShareInput = {
  bucketId?: InputMaybe<Scalars['ID']['input']>;
  fileId?: InputMaybe<Scalars['ID']['input']>;
  user: Scalars['ID']['input'];
};

export type Domain = {
  __typename?: 'Domain';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type DomainConnection = {
  __typename?: 'DomainConnection';
  edges?: Maybe<Array<Maybe<Domain>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DownloadFileInput = {
  id: Scalars['ID']['input'];
};

export type DownloadFilePayload = {
  __typename?: 'DownloadFilePayload';
  url: Scalars['String']['output'];
};

export type DownloadFilesInput = {
  ids: Array<Scalars['ID']['input']>;
};

export type DownloadFilesPayload = {
  __typename?: 'DownloadFilesPayload';
  /** The url to download a zip file containing all the files. */
  url: Scalars['String']['output'];
};

export type Email = {
  __typename?: 'Email';
  address: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type: EmailType;
};

export type EmailAccount = {
  __typename?: 'EmailAccount';
  active?: Maybe<Scalars['Boolean']['output']>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  members?: Maybe<Array<Maybe<EmailGroupMember>>>;
  name: Scalars['String']['output'];
  quota?: Maybe<Scalars['Int']['output']>;
  type: EmailAccountType;
  user?: Maybe<User>;
};

export type EmailAccountConnection = {
  __typename?: 'EmailAccountConnection';
  edges?: Maybe<Array<Maybe<EmailAccount>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type EmailAccountFilter = {
  type?: InputMaybe<EmailAccountType>;
};

export enum EmailAccountType {
  Group = 'GROUP',
  Individual = 'INDIVIDUAL'
}

export type EmailConnection = {
  __typename?: 'EmailConnection';
  edges?: Maybe<Array<Maybe<Email>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type EmailForwarding = {
  __typename?: 'EmailForwarding';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  origin: Scalars['String']['output'];
  target: Scalars['String']['output'];
};

export type EmailForwardingConnection = {
  __typename?: 'EmailForwardingConnection';
  edges?: Maybe<Array<Maybe<EmailForwarding>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type EmailGroupMember = {
  __typename?: 'EmailGroupMember';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  memberOf: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type EmailGroupMemberConnection = {
  __typename?: 'EmailGroupMemberConnection';
  edges?: Maybe<Array<Maybe<EmailGroupMember>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum EmailType {
  Alias = 'ALIAS',
  List = 'LIST',
  Primary = 'PRIMARY'
}

export type Entry = {
  __typename?: 'Entry';
  body?: Maybe<Scalars['String']['output']>;
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
  MIMEType: Scalars['String']['output'];
  bucket: Bucket;
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  fileType: FileType;
  files: Array<File>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<File>;
  parents: Array<File>;
  size: Scalars['Int']['output'];
};

export type FileConnection = {
  __typename?: 'FileConnection';
  edges: Array<File>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum FilePermission {
  Manager = 'Manager',
  Viewer = 'Viewer'
}

export enum FileType {
  Blob = 'blob',
  Folder = 'folder'
}

export type FileUploadInput = {
  /** The shared drive to upload the file to if empty the file will be uploaded to the root folder of the user. */
  bucketId?: InputMaybe<Scalars['ID']['input']>;
  file: Scalars['Upload']['input'];
  /** The folder to upload the file to if empty the file will be uploaded to the root folder of the user. */
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type FilesFilterInput = {
  bucketId?: InputMaybe<Scalars['String']['input']>;
  myBucket?: InputMaybe<Scalars['Boolean']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
};

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
};

export type ForgotPasswordPayload = {
  __typename?: 'ForgotPasswordPayload';
  success: Scalars['Boolean']['output'];
};

export type GenerateFileUrlInput = {
  id: Scalars['ID']['input'];
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

export type MoveFileInput = {
  id: Scalars['ID']['input'];
  targetId?: InputMaybe<Scalars['ID']['input']>;
};

export type MoveFilesInput = {
  ids: Array<Scalars['ID']['input']>;
  targetId: Scalars['ID']['input'];
};

export type MoveFilesPayload = {
  __typename?: 'MoveFilesPayload';
  files: Array<File>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvite: SignInPayload;
  addFileShare: File;
  addUserToChat: ChatUser;
  archiveEntry: Entry;
  archiveEvent: Event;
  archiveTag: Tag;
  archiveUser: User;
  archiveUserCompetence: UserCompetence;
  copyFile: File;
  copyFiles: CopyFilesPayload;
  createChat: Chat;
  createCompetence: Competence;
  createDomain?: Maybe<Domain>;
  createEmail?: Maybe<Email>;
  createEmailAccount?: Maybe<EmailAccount>;
  createEmailForwarding?: Maybe<EmailForwarding>;
  createEmailGroup?: Maybe<EmailAccount>;
  createEmailGroupMember?: Maybe<EmailGroupMember>;
  createEntry: Entry;
  createEntryCompetence: Entry;
  createEntryEvent: Entry;
  createEntryFile: Entry;
  createEntryTag: Entry;
  createEntryUser: Entry;
  createEvent: Event;
  createFolder: File;
  createReport: Report;
  createSchoolYear: SchoolYear;
  createShare: ShareUser;
  createSharedDrive: Bucket;
  createStudent: User;
  createSubject: Subject;
  createTag: Tag;
  createUser: User;
  createUserCompetence: UserCompetence;
  deleteChat: Chat;
  deleteDomain?: Maybe<Domain>;
  deleteEmail?: Maybe<Email>;
  deleteEmailAccount?: Maybe<EmailAccount>;
  deleteEmailForwarding?: Maybe<EmailForwarding>;
  deleteEmailGroup?: Maybe<EmailAccount>;
  deleteEmailGroupMember?: Maybe<EmailGroupMember>;
  deleteEntryCompetence: Entry;
  deleteEntryEvent: Entry;
  deleteEntryFile: Entry;
  deleteEntryTag: Entry;
  deleteEntryUser: Entry;
  deleteFile: DeleteFilePayload;
  deleteFiles: DeleteFilesPayload;
  deleteSchoolYear: SchoolYear;
  deleteShare: ShareUser;
  deleteSharedDrive: Bucket;
  deleteSubject: Subject;
  downloadFile: DownloadFilePayload;
  downloadFiles: DownloadFilesPayload;
  editShare: ShareUser;
  forgotPassword: ForgotPasswordPayload;
  importStudents: ImportStudentsPayload;
  moveFile: File;
  moveFiles: MoveFilesPayload;
  previewFile: PreviewFilePayload;
  removeFileShare: File;
  removeUserFromChat: ChatUser;
  renameFile: File;
  renameSharedDrive: Bucket;
  resetPassword: ResetPasswordPayload;
  sendMessage: ChatMessage;
  sendUserInvite: Scalars['Boolean']['output'];
  setUserAttendanceState: UserAttendance;
  signIn: SignInPayload;
  signOut: Scalars['Boolean']['output'];
  toggleEventCompetence: Event;
  updateChat: Chat;
  updateCompetence: Competence;
  updateCompetenceSorting: Array<Maybe<Competence>>;
  updateDailyAttendance: Array<UserAttendance>;
  updateEmailAccount?: Maybe<EmailAccount>;
  updateEmailGroup?: Maybe<EmailAccount>;
  updateEntry: Entry;
  updateEntryUserCompetenceLevel: Entry;
  updateEvent: Event;
  updateOrganisation: Organisation;
  updatePassword: Scalars['Boolean']['output'];
  updateSchoolYear: SchoolYear;
  updateSubject: Subject;
  updateTag: Tag;
  updateUser: User;
  updateUserLanguage: User;
  updateUserStudentGrade: UserStudentGrades;
  uploadFile: File;
  uploadFiles: UploadFilesPayload;
};


export type MutationAcceptInviteArgs = {
  input: SignUpInput;
  token: Scalars['String']['input'];
};


export type MutationAddFileShareArgs = {
  input: ShareFileInput;
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


export type MutationCopyFileArgs = {
  input: CopyFileInput;
};


export type MutationCopyFilesArgs = {
  input: CopyFilesInput;
};


export type MutationCreateChatArgs = {
  input: CreateChatInput;
};


export type MutationCreateCompetenceArgs = {
  input: CreateCompetenceInput;
};


export type MutationCreateDomainArgs = {
  input: CreateDomainInput;
};


export type MutationCreateEmailArgs = {
  input: CreateEmailInput;
};


export type MutationCreateEmailAccountArgs = {
  input: CreateEmailAccountInput;
};


export type MutationCreateEmailForwardingArgs = {
  input: CreateEmailForwardingInput;
};


export type MutationCreateEmailGroupArgs = {
  input: CreateEmailGroupInput;
};


export type MutationCreateEmailGroupMemberArgs = {
  input: CreateEmailGroupMemberInput;
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


export type MutationCreateFolderArgs = {
  input: CreateFolderInput;
};


export type MutationCreateReportArgs = {
  input: CreateReportInput;
};


export type MutationCreateSchoolYearArgs = {
  input: CreateSchoolYearInput;
};


export type MutationCreateShareArgs = {
  input: CreateShareInput;
};


export type MutationCreateSharedDriveArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateStudentArgs = {
  input: CreateStudentInput;
};


export type MutationCreateSubjectArgs = {
  input: CreateSubjectInput;
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


export type MutationDeleteDomainArgs = {
  input: DeleteDomainInput;
};


export type MutationDeleteEmailArgs = {
  input: DeleteEmailInput;
};


export type MutationDeleteEmailAccountArgs = {
  input: DeleteEmailAccountInput;
};


export type MutationDeleteEmailForwardingArgs = {
  input: DeleteEmailForwardingInput;
};


export type MutationDeleteEmailGroupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEmailGroupMemberArgs = {
  input: DeleteEmailGroupMemberInput;
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


export type MutationDeleteFilesArgs = {
  input: DeleteFilesInput;
};


export type MutationDeleteSchoolYearArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShareArgs = {
  input: DeleteShareInput;
};


export type MutationDeleteSharedDriveArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSubjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDownloadFileArgs = {
  input: DownloadFileInput;
};


export type MutationDownloadFilesArgs = {
  input: DownloadFilesInput;
};


export type MutationEditShareArgs = {
  input: CreateShareInput;
};


export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};


export type MutationImportStudentsArgs = {
  input: ImportStudentsInput;
};


export type MutationMoveFileArgs = {
  input: MoveFileInput;
};


export type MutationMoveFilesArgs = {
  input: MoveFilesInput;
};


export type MutationPreviewFileArgs = {
  input: PreviewFileInput;
};


export type MutationRemoveFileShareArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRemoveUserFromChatArgs = {
  input: RemoveUserFromChatInput;
};


export type MutationRenameFileArgs = {
  input: RenameFileInput;
};


export type MutationRenameSharedDriveArgs = {
  input: RenameSharedDriveInput;
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


export type MutationSetUserAttendanceStateArgs = {
  date: Scalars['Time']['input'];
  state: UserAttendanceState;
  userId: Scalars['ID']['input'];
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


export type MutationUpdateDailyAttendanceArgs = {
  date: Scalars['Time']['input'];
  state: UserAttendanceState;
};


export type MutationUpdateEmailAccountArgs = {
  input: UpdateEmailAccountInput;
};


export type MutationUpdateEmailGroupArgs = {
  input: UpdateEmailGroupInput;
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


export type MutationUpdateOrganisationArgs = {
  input: UpdateOrganisationInput;
};


export type MutationUpdatePasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationUpdateSchoolYearArgs = {
  input: UpdateSchoolYearInput;
};


export type MutationUpdateSubjectArgs = {
  input: UpdateSubjectInput;
};


export type MutationUpdateTagArgs = {
  id: Scalars['ID']['input'];
  input: CreateTagInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserLanguageArgs = {
  language: UserLanguage;
};


export type MutationUpdateUserStudentGradeArgs = {
  input: UpdateUserStudentGradesInput;
};


export type MutationUploadFileArgs = {
  input: FileUploadInput;
};


export type MutationUploadFilesArgs = {
  input: FileUploadInput;
};

export type MyFilesFilterInput = {
  parentId?: InputMaybe<Scalars['String']['input']>;
};

export type Organisation = {
  __typename?: 'Organisation';
  id: Scalars['ID']['output'];
  legalName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  owner: User;
  phone?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  currentPage: Scalars['Int']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
};

export type PreviewFileInput = {
  id: Scalars['ID']['input'];
};

export type PreviewFilePayload = {
  __typename?: 'PreviewFilePayload';
  url: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  EmailGroupMember?: Maybe<EmailGroupMember>;
  EmailGroupMembers?: Maybe<EmailGroupMemberConnection>;
  bucket: Bucket;
  buckets: BucketConnection;
  chat: Chat;
  chats: ChatConnection;
  competence: Competence;
  competences: CompetenceConnection;
  domain?: Maybe<Domain>;
  domains?: Maybe<DomainConnection>;
  email?: Maybe<Email>;
  emailAccount?: Maybe<EmailAccount>;
  emailAccounts?: Maybe<EmailAccountConnection>;
  emailForwarding?: Maybe<EmailForwarding>;
  emailForwardings?: Maybe<EmailForwardingConnection>;
  emails?: Maybe<EmailConnection>;
  entries: EntryConnection;
  entry: Entry;
  event: Event;
  events: EventConnection;
  exportEvents: Array<Maybe<ExportEventsPayload>>;
  file: File;
  files: FileConnection;
  inviteDetails: InviteDetailsPayload;
  me: User;
  organisation?: Maybe<Organisation>;
  report: Report;
  reports: ReportConnection;
  schoolYear: SchoolYear;
  schoolYears: SchoolYearConnection;
  shares?: Maybe<Array<ShareUser>>;
  subject: Subject;
  subjects: SubjectConnection;
  tag: Tag;
  tags: TagConnection;
  user: User;
  userAttendanceOverview: Array<UserAttendance>;
  userStudent: UserStudent;
  userStudentGrade: UserStudentGrades;
  userStudentGrades: UserStudentGradesConnection;
  userStudents: UserStudentConnection;
  users: UserConnection;
};


export type QueryEmailGroupMemberArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBucketArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBucketsArgs = {
  input?: InputMaybe<BucketFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryDomainArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEmailArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEmailAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEmailAccountsArgs = {
  filter?: InputMaybe<EmailAccountFilter>;
};


export type QueryEmailForwardingArgs = {
  id: Scalars['ID']['input'];
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
  input?: InputMaybe<FilesFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryInviteDetailsArgs = {
  token: Scalars['String']['input'];
};


export type QueryReportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySchoolYearArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySchoolYearsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySharesArgs = {
  input?: InputMaybe<ShareInput>;
};


export type QuerySubjectArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySubjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserAttendanceOverviewArgs = {
  date: Scalars['Time']['input'];
};


export type QueryUserStudentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserStudentGradeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserStudentGradesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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

export type RenameFileInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type RenameSharedDriveInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
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
  invalidToken: Scalars['Boolean']['output'];
  success: Scalars['Boolean']['output'];
  tokenExpired: Scalars['Boolean']['output'];
  unableToReset: Scalars['Boolean']['output'];
  unauthorized: Scalars['Boolean']['output'];
};

export type SchoolYear = {
  __typename?: 'SchoolYear';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  year: Scalars['Int']['output'];
};

export type SchoolYearConnection = {
  __typename?: 'SchoolYearConnection';
  edges: Array<SchoolYear>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SendMessageInput = {
  chatId: Scalars['ID']['input'];
  message: Scalars['String']['input'];
};

export type ShareFileInput = {
  emails: Array<Scalars['String']['input']>;
  fileId: Scalars['ID']['input'];
  permission: FilePermission;
  users: Array<Scalars['ID']['input']>;
};

export type ShareInput = {
  bucketId?: InputMaybe<Scalars['ID']['input']>;
  fileId?: InputMaybe<Scalars['ID']['input']>;
};

export type ShareUser = {
  __typename?: 'ShareUser';
  permission: FilePermission;
  user: User;
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
  enabled_apps: Array<Scalars['String']['output']>;
  language: Scalars['String']['output'];
  setupComplete: Scalars['Boolean']['output'];
  token: Scalars['String']['output'];
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

export type Subject = {
  __typename?: 'Subject';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type SubjectConnection = {
  __typename?: 'SubjectConnection';
  edges: Array<Subject>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  messageAdded: ChatMessage;
};


export type SubscriptionMessageAddedArgs = {
  chatId: Scalars['ID']['input'];
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

export type UpdateEmailAccountInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  quota?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<EmailAccountType>;
};

export type UpdateEmailGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  members?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateOrganisationInput = {
  id: Scalars['ID']['input'];
  legalName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSchoolYearInput = {
  id: Scalars['ID']['input'];
  year: Scalars['Int']['input'];
};

export type UpdateSubjectInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
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
};

export type UpdateUserStudentGradesInput = {
  grade: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
};

export type UploadFilesPayload = {
  __typename?: 'UploadFilesPayload';
  files: Array<File>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailAccounts?: Maybe<Array<Maybe<EmailAccount>>>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  inviteAccepted: Scalars['Boolean']['output'];
  language?: Maybe<UserLanguage>;
  lastName: Scalars['String']['output'];
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

export type UserFileFilterInput = {
  folderId?: InputMaybe<Scalars['String']['input']>;
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
  nationality?: Maybe<Scalars['String']['output']>;
  user: User;
};

export type UserStudentConnection = {
  __typename?: 'UserStudentConnection';
  edges?: Maybe<Array<Maybe<UserStudent>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserStudentGrades = {
  __typename?: 'UserStudentGrades';
  grade: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  schoolYear: SchoolYear;
  student: UserStudent;
  subject: Subject;
};

export type UserStudentGradesConnection = {
  __typename?: 'UserStudentGradesConnection';
  edges: Array<UserStudentGrades>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WithTypename<T extends { __typename?: any }> = Partial<T> & { __typename: NonNullable<T['__typename']> };

export type GraphCacheKeysConfig = {
  Bucket?: (data: WithTypename<Bucket>) => null | string,
  BucketConnection?: (data: WithTypename<BucketConnection>) => null | string,
  Chat?: (data: WithTypename<Chat>) => null | string,
  ChatConnection?: (data: WithTypename<ChatConnection>) => null | string,
  ChatMessage?: (data: WithTypename<ChatMessage>) => null | string,
  ChatUser?: (data: WithTypename<ChatUser>) => null | string,
  Competence?: (data: WithTypename<Competence>) => null | string,
  CompetenceConnection?: (data: WithTypename<CompetenceConnection>) => null | string,
  CompetenceTendency?: (data: WithTypename<CompetenceTendency>) => null | string,
  CopyFilesPayload?: (data: WithTypename<CopyFilesPayload>) => null | string,
  DeleteFilePayload?: (data: WithTypename<DeleteFilePayload>) => null | string,
  DeleteFilesPayload?: (data: WithTypename<DeleteFilesPayload>) => null | string,
  Domain?: (data: WithTypename<Domain>) => null | string,
  DomainConnection?: (data: WithTypename<DomainConnection>) => null | string,
  DownloadFilePayload?: (data: WithTypename<DownloadFilePayload>) => null | string,
  DownloadFilesPayload?: (data: WithTypename<DownloadFilesPayload>) => null | string,
  Email?: (data: WithTypename<Email>) => null | string,
  EmailAccount?: (data: WithTypename<EmailAccount>) => null | string,
  EmailAccountConnection?: (data: WithTypename<EmailAccountConnection>) => null | string,
  EmailConnection?: (data: WithTypename<EmailConnection>) => null | string,
  EmailForwarding?: (data: WithTypename<EmailForwarding>) => null | string,
  EmailForwardingConnection?: (data: WithTypename<EmailForwardingConnection>) => null | string,
  EmailGroupMember?: (data: WithTypename<EmailGroupMember>) => null | string,
  EmailGroupMemberConnection?: (data: WithTypename<EmailGroupMemberConnection>) => null | string,
  Entry?: (data: WithTypename<Entry>) => null | string,
  EntryConnection?: (data: WithTypename<EntryConnection>) => null | string,
  Event?: (data: WithTypename<Event>) => null | string,
  EventConnection?: (data: WithTypename<EventConnection>) => null | string,
  ExportEventsPayload?: (data: WithTypename<ExportEventsPayload>) => null | string,
  File?: (data: WithTypename<File>) => null | string,
  FileConnection?: (data: WithTypename<FileConnection>) => null | string,
  ForgotPasswordPayload?: (data: WithTypename<ForgotPasswordPayload>) => null | string,
  ImportStudentsPayload?: (data: WithTypename<ImportStudentsPayload>) => null | string,
  InviteDetailsPayload?: (data: WithTypename<InviteDetailsPayload>) => null | string,
  MoveFilesPayload?: (data: WithTypename<MoveFilesPayload>) => null | string,
  Organisation?: (data: WithTypename<Organisation>) => null | string,
  PageInfo?: (data: WithTypename<PageInfo>) => null | string,
  PreviewFilePayload?: (data: WithTypename<PreviewFilePayload>) => null | string,
  Report?: (data: WithTypename<Report>) => null | string,
  ReportConnection?: (data: WithTypename<ReportConnection>) => null | string,
  ResetPasswordPayload?: (data: WithTypename<ResetPasswordPayload>) => null | string,
  SchoolYear?: (data: WithTypename<SchoolYear>) => null | string,
  SchoolYearConnection?: (data: WithTypename<SchoolYearConnection>) => null | string,
  ShareUser?: (data: WithTypename<ShareUser>) => null | string,
  SignInPayload?: (data: WithTypename<SignInPayload>) => null | string,
  Subject?: (data: WithTypename<Subject>) => null | string,
  SubjectConnection?: (data: WithTypename<SubjectConnection>) => null | string,
  Tag?: (data: WithTypename<Tag>) => null | string,
  TagConnection?: (data: WithTypename<TagConnection>) => null | string,
  UploadFilesPayload?: (data: WithTypename<UploadFilesPayload>) => null | string,
  User?: (data: WithTypename<User>) => null | string,
  UserAttendance?: (data: WithTypename<UserAttendance>) => null | string,
  UserCompetence?: (data: WithTypename<UserCompetence>) => null | string,
  UserCompetenceConnection?: (data: WithTypename<UserCompetenceConnection>) => null | string,
  UserConnection?: (data: WithTypename<UserConnection>) => null | string,
  UserStudent?: (data: WithTypename<UserStudent>) => null | string,
  UserStudentConnection?: (data: WithTypename<UserStudentConnection>) => null | string,
  UserStudentGrades?: (data: WithTypename<UserStudentGrades>) => null | string,
  UserStudentGradesConnection?: (data: WithTypename<UserStudentGradesConnection>) => null | string
}

export type GraphCacheResolvers = {
  Query?: {
    EmailGroupMember?: GraphCacheResolver<WithTypename<Query>, QueryEmailGroupMemberArgs, WithTypename<EmailGroupMember> | string>,
    EmailGroupMembers?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<EmailGroupMemberConnection> | string>,
    bucket?: GraphCacheResolver<WithTypename<Query>, QueryBucketArgs, WithTypename<Bucket> | string>,
    buckets?: GraphCacheResolver<WithTypename<Query>, QueryBucketsArgs, WithTypename<BucketConnection> | string>,
    chat?: GraphCacheResolver<WithTypename<Query>, QueryChatArgs, WithTypename<Chat> | string>,
    chats?: GraphCacheResolver<WithTypename<Query>, QueryChatsArgs, WithTypename<ChatConnection> | string>,
    competence?: GraphCacheResolver<WithTypename<Query>, QueryCompetenceArgs, WithTypename<Competence> | string>,
    competences?: GraphCacheResolver<WithTypename<Query>, QueryCompetencesArgs, WithTypename<CompetenceConnection> | string>,
    domain?: GraphCacheResolver<WithTypename<Query>, QueryDomainArgs, WithTypename<Domain> | string>,
    domains?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<DomainConnection> | string>,
    email?: GraphCacheResolver<WithTypename<Query>, QueryEmailArgs, WithTypename<Email> | string>,
    emailAccount?: GraphCacheResolver<WithTypename<Query>, QueryEmailAccountArgs, WithTypename<EmailAccount> | string>,
    emailAccounts?: GraphCacheResolver<WithTypename<Query>, QueryEmailAccountsArgs, WithTypename<EmailAccountConnection> | string>,
    emailForwarding?: GraphCacheResolver<WithTypename<Query>, QueryEmailForwardingArgs, WithTypename<EmailForwarding> | string>,
    emailForwardings?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<EmailForwardingConnection> | string>,
    emails?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<EmailConnection> | string>,
    entries?: GraphCacheResolver<WithTypename<Query>, QueryEntriesArgs, WithTypename<EntryConnection> | string>,
    entry?: GraphCacheResolver<WithTypename<Query>, QueryEntryArgs, WithTypename<Entry> | string>,
    event?: GraphCacheResolver<WithTypename<Query>, QueryEventArgs, WithTypename<Event> | string>,
    events?: GraphCacheResolver<WithTypename<Query>, QueryEventsArgs, WithTypename<EventConnection> | string>,
    exportEvents?: GraphCacheResolver<WithTypename<Query>, QueryExportEventsArgs, Array<WithTypename<ExportEventsPayload> | string>>,
    file?: GraphCacheResolver<WithTypename<Query>, QueryFileArgs, WithTypename<File> | string>,
    files?: GraphCacheResolver<WithTypename<Query>, QueryFilesArgs, WithTypename<FileConnection> | string>,
    inviteDetails?: GraphCacheResolver<WithTypename<Query>, QueryInviteDetailsArgs, WithTypename<InviteDetailsPayload> | string>,
    me?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<User> | string>,
    organisation?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<Organisation> | string>,
    report?: GraphCacheResolver<WithTypename<Query>, QueryReportArgs, WithTypename<Report> | string>,
    reports?: GraphCacheResolver<WithTypename<Query>, QueryReportsArgs, WithTypename<ReportConnection> | string>,
    schoolYear?: GraphCacheResolver<WithTypename<Query>, QuerySchoolYearArgs, WithTypename<SchoolYear> | string>,
    schoolYears?: GraphCacheResolver<WithTypename<Query>, QuerySchoolYearsArgs, WithTypename<SchoolYearConnection> | string>,
    shares?: GraphCacheResolver<WithTypename<Query>, QuerySharesArgs, Array<WithTypename<ShareUser> | string>>,
    subject?: GraphCacheResolver<WithTypename<Query>, QuerySubjectArgs, WithTypename<Subject> | string>,
    subjects?: GraphCacheResolver<WithTypename<Query>, QuerySubjectsArgs, WithTypename<SubjectConnection> | string>,
    tag?: GraphCacheResolver<WithTypename<Query>, QueryTagArgs, WithTypename<Tag> | string>,
    tags?: GraphCacheResolver<WithTypename<Query>, QueryTagsArgs, WithTypename<TagConnection> | string>,
    user?: GraphCacheResolver<WithTypename<Query>, QueryUserArgs, WithTypename<User> | string>,
    userAttendanceOverview?: GraphCacheResolver<WithTypename<Query>, QueryUserAttendanceOverviewArgs, Array<WithTypename<UserAttendance> | string>>,
    userStudent?: GraphCacheResolver<WithTypename<Query>, QueryUserStudentArgs, WithTypename<UserStudent> | string>,
    userStudentGrade?: GraphCacheResolver<WithTypename<Query>, QueryUserStudentGradeArgs, WithTypename<UserStudentGrades> | string>,
    userStudentGrades?: GraphCacheResolver<WithTypename<Query>, QueryUserStudentGradesArgs, WithTypename<UserStudentGradesConnection> | string>,
    userStudents?: GraphCacheResolver<WithTypename<Query>, QueryUserStudentsArgs, WithTypename<UserStudentConnection> | string>,
    users?: GraphCacheResolver<WithTypename<Query>, QueryUsersArgs, WithTypename<UserConnection> | string>
  },
  Bucket?: {
    createdAt?: GraphCacheResolver<WithTypename<Bucket>, Record<string, never>, Scalars['Time'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<Bucket>, Record<string, never>, Scalars['Time'] | string>,
    files?: GraphCacheResolver<WithTypename<Bucket>, Record<string, never>, Array<WithTypename<File> | string>>,
    id?: GraphCacheResolver<WithTypename<Bucket>, Record<string, never>, Scalars['ID'] | string>,
    name?: GraphCacheResolver<WithTypename<Bucket>, Record<string, never>, Scalars['String'] | string>,
    permission?: GraphCacheResolver<WithTypename<Bucket>, Record<string, never>, FilePermission | string>,
    shared?: GraphCacheResolver<WithTypename<Bucket>, Record<string, never>, Scalars['Boolean'] | string>,
    user?: GraphCacheResolver<WithTypename<Bucket>, Record<string, never>, WithTypename<User> | string>
  },
  BucketConnection?: {
    edges?: GraphCacheResolver<WithTypename<BucketConnection>, Record<string, never>, Array<WithTypename<Bucket> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<BucketConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<BucketConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  Chat?: {
    createdAt?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Scalars['Time'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Scalars['Time'] | string>,
    id?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Scalars['ID'] | string>,
    lastMessage?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Scalars['String'] | string>,
    messages?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Array<WithTypename<ChatMessage> | string>>,
    name?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, Scalars['String'] | string>,
    type?: GraphCacheResolver<WithTypename<Chat>, Record<string, never>, ChatType | string>,
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
    message?: GraphCacheResolver<WithTypename<ChatMessage>, Record<string, never>, Scalars['String'] | string>,
    user?: GraphCacheResolver<WithTypename<ChatMessage>, Record<string, never>, WithTypename<User> | string>
  },
  ChatUser?: {
    chat?: GraphCacheResolver<WithTypename<ChatUser>, Record<string, never>, WithTypename<Chat> | string>,
    createdAt?: GraphCacheResolver<WithTypename<ChatUser>, Record<string, never>, Scalars['Time'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<ChatUser>, Record<string, never>, Scalars['Time'] | string>,
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
  CopyFilesPayload?: {
    files?: GraphCacheResolver<WithTypename<CopyFilesPayload>, Record<string, never>, Array<WithTypename<File> | string>>
  },
  DeleteFilePayload?: {
    file?: GraphCacheResolver<WithTypename<DeleteFilePayload>, Record<string, never>, WithTypename<File> | string>,
    success?: GraphCacheResolver<WithTypename<DeleteFilePayload>, Record<string, never>, Scalars['Boolean'] | string>
  },
  DeleteFilesPayload?: {
    files?: GraphCacheResolver<WithTypename<DeleteFilesPayload>, Record<string, never>, Array<WithTypename<File> | string>>,
    success?: GraphCacheResolver<WithTypename<DeleteFilesPayload>, Record<string, never>, Scalars['Boolean'] | string>
  },
  Domain?: {
    createdAt?: GraphCacheResolver<WithTypename<Domain>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<Domain>, Record<string, never>, Scalars['ID'] | string>,
    name?: GraphCacheResolver<WithTypename<Domain>, Record<string, never>, Scalars['String'] | string>
  },
  DomainConnection?: {
    edges?: GraphCacheResolver<WithTypename<DomainConnection>, Record<string, never>, Array<WithTypename<Domain> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<DomainConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<DomainConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  DownloadFilePayload?: {
    url?: GraphCacheResolver<WithTypename<DownloadFilePayload>, Record<string, never>, Scalars['String'] | string>
  },
  DownloadFilesPayload?: {
    url?: GraphCacheResolver<WithTypename<DownloadFilesPayload>, Record<string, never>, Scalars['String'] | string>
  },
  Email?: {
    address?: GraphCacheResolver<WithTypename<Email>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<Email>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<Email>, Record<string, never>, Scalars['ID'] | string>,
    name?: GraphCacheResolver<WithTypename<Email>, Record<string, never>, Scalars['String'] | string>,
    type?: GraphCacheResolver<WithTypename<Email>, Record<string, never>, EmailType | string>
  },
  EmailAccount?: {
    active?: GraphCacheResolver<WithTypename<EmailAccount>, Record<string, never>, Scalars['Boolean'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<EmailAccount>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<EmailAccount>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<EmailAccount>, Record<string, never>, Scalars['ID'] | string>,
    members?: GraphCacheResolver<WithTypename<EmailAccount>, Record<string, never>, Array<WithTypename<EmailGroupMember> | string>>,
    name?: GraphCacheResolver<WithTypename<EmailAccount>, Record<string, never>, Scalars['String'] | string>,
    quota?: GraphCacheResolver<WithTypename<EmailAccount>, Record<string, never>, Scalars['Int'] | string>,
    type?: GraphCacheResolver<WithTypename<EmailAccount>, Record<string, never>, EmailAccountType | string>,
    user?: GraphCacheResolver<WithTypename<EmailAccount>, Record<string, never>, WithTypename<User> | string>
  },
  EmailAccountConnection?: {
    edges?: GraphCacheResolver<WithTypename<EmailAccountConnection>, Record<string, never>, Array<WithTypename<EmailAccount> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<EmailAccountConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<EmailAccountConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  EmailConnection?: {
    edges?: GraphCacheResolver<WithTypename<EmailConnection>, Record<string, never>, Array<WithTypename<Email> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<EmailConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<EmailConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  EmailForwarding?: {
    createdAt?: GraphCacheResolver<WithTypename<EmailForwarding>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<EmailForwarding>, Record<string, never>, Scalars['ID'] | string>,
    origin?: GraphCacheResolver<WithTypename<EmailForwarding>, Record<string, never>, Scalars['String'] | string>,
    target?: GraphCacheResolver<WithTypename<EmailForwarding>, Record<string, never>, Scalars['String'] | string>
  },
  EmailForwardingConnection?: {
    edges?: GraphCacheResolver<WithTypename<EmailForwardingConnection>, Record<string, never>, Array<WithTypename<EmailForwarding> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<EmailForwardingConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<EmailForwardingConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  EmailGroupMember?: {
    createdAt?: GraphCacheResolver<WithTypename<EmailGroupMember>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<EmailGroupMember>, Record<string, never>, Scalars['ID'] | string>,
    memberOf?: GraphCacheResolver<WithTypename<EmailGroupMember>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<EmailGroupMember>, Record<string, never>, Scalars['String'] | string>
  },
  EmailGroupMemberConnection?: {
    edges?: GraphCacheResolver<WithTypename<EmailGroupMemberConnection>, Record<string, never>, Array<WithTypename<EmailGroupMember> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<EmailGroupMemberConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<EmailGroupMemberConnection>, Record<string, never>, Scalars['Int'] | string>
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
    MIMEType?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Scalars['String'] | string>,
    bucket?: GraphCacheResolver<WithTypename<File>, Record<string, never>, WithTypename<Bucket> | string>,
    createdAt?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Scalars['Time'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Scalars['Time'] | string>,
    fileType?: GraphCacheResolver<WithTypename<File>, Record<string, never>, FileType | string>,
    files?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Array<WithTypename<File> | string>>,
    id?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Scalars['ID'] | string>,
    name?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Scalars['String'] | string>,
    parent?: GraphCacheResolver<WithTypename<File>, Record<string, never>, WithTypename<File> | string>,
    parents?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Array<WithTypename<File> | string>>,
    size?: GraphCacheResolver<WithTypename<File>, Record<string, never>, Scalars['Int'] | string>
  },
  FileConnection?: {
    edges?: GraphCacheResolver<WithTypename<FileConnection>, Record<string, never>, Array<WithTypename<File> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<FileConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<FileConnection>, Record<string, never>, Scalars['Int'] | string>
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
  MoveFilesPayload?: {
    files?: GraphCacheResolver<WithTypename<MoveFilesPayload>, Record<string, never>, Array<WithTypename<File> | string>>
  },
  Organisation?: {
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
  PreviewFilePayload?: {
    url?: GraphCacheResolver<WithTypename<PreviewFilePayload>, Record<string, never>, Scalars['String'] | string>
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
    invalidToken?: GraphCacheResolver<WithTypename<ResetPasswordPayload>, Record<string, never>, Scalars['Boolean'] | string>,
    success?: GraphCacheResolver<WithTypename<ResetPasswordPayload>, Record<string, never>, Scalars['Boolean'] | string>,
    tokenExpired?: GraphCacheResolver<WithTypename<ResetPasswordPayload>, Record<string, never>, Scalars['Boolean'] | string>,
    unableToReset?: GraphCacheResolver<WithTypename<ResetPasswordPayload>, Record<string, never>, Scalars['Boolean'] | string>,
    unauthorized?: GraphCacheResolver<WithTypename<ResetPasswordPayload>, Record<string, never>, Scalars['Boolean'] | string>
  },
  SchoolYear?: {
    description?: GraphCacheResolver<WithTypename<SchoolYear>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<SchoolYear>, Record<string, never>, Scalars['ID'] | string>,
    year?: GraphCacheResolver<WithTypename<SchoolYear>, Record<string, never>, Scalars['Int'] | string>
  },
  SchoolYearConnection?: {
    edges?: GraphCacheResolver<WithTypename<SchoolYearConnection>, Record<string, never>, Array<WithTypename<SchoolYear> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<SchoolYearConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<SchoolYearConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  ShareUser?: {
    permission?: GraphCacheResolver<WithTypename<ShareUser>, Record<string, never>, FilePermission | string>,
    user?: GraphCacheResolver<WithTypename<ShareUser>, Record<string, never>, WithTypename<User> | string>
  },
  SignInPayload?: {
    enabled_apps?: GraphCacheResolver<WithTypename<SignInPayload>, Record<string, never>, Array<Scalars['String'] | string>>,
    language?: GraphCacheResolver<WithTypename<SignInPayload>, Record<string, never>, Scalars['String'] | string>,
    setupComplete?: GraphCacheResolver<WithTypename<SignInPayload>, Record<string, never>, Scalars['Boolean'] | string>,
    token?: GraphCacheResolver<WithTypename<SignInPayload>, Record<string, never>, Scalars['String'] | string>
  },
  Subject?: {
    id?: GraphCacheResolver<WithTypename<Subject>, Record<string, never>, Scalars['ID'] | string>,
    name?: GraphCacheResolver<WithTypename<Subject>, Record<string, never>, Scalars['String'] | string>
  },
  SubjectConnection?: {
    edges?: GraphCacheResolver<WithTypename<SubjectConnection>, Record<string, never>, Array<WithTypename<Subject> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<SubjectConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<SubjectConnection>, Record<string, never>, Scalars['Int'] | string>
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
  UploadFilesPayload?: {
    files?: GraphCacheResolver<WithTypename<UploadFilesPayload>, Record<string, never>, Array<WithTypename<File> | string>>
  },
  User?: {
    createdAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Time'] | string>,
    deletedAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Time'] | string>,
    email?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    emailAccounts?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Array<WithTypename<EmailAccount> | string>>,
    firstName?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['ID'] | string>,
    inviteAccepted?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Boolean'] | string>,
    language?: GraphCacheResolver<WithTypename<User>, Record<string, never>, UserLanguage | string>,
    lastName?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
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
    nationality?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, Scalars['String'] | string>,
    user?: GraphCacheResolver<WithTypename<UserStudent>, Record<string, never>, WithTypename<User> | string>
  },
  UserStudentConnection?: {
    edges?: GraphCacheResolver<WithTypename<UserStudentConnection>, Record<string, never>, Array<WithTypename<UserStudent> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<UserStudentConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<UserStudentConnection>, Record<string, never>, Scalars['Int'] | string>
  },
  UserStudentGrades?: {
    grade?: GraphCacheResolver<WithTypename<UserStudentGrades>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<UserStudentGrades>, Record<string, never>, Scalars['ID'] | string>,
    schoolYear?: GraphCacheResolver<WithTypename<UserStudentGrades>, Record<string, never>, WithTypename<SchoolYear> | string>,
    student?: GraphCacheResolver<WithTypename<UserStudentGrades>, Record<string, never>, WithTypename<UserStudent> | string>,
    subject?: GraphCacheResolver<WithTypename<UserStudentGrades>, Record<string, never>, WithTypename<Subject> | string>
  },
  UserStudentGradesConnection?: {
    edges?: GraphCacheResolver<WithTypename<UserStudentGradesConnection>, Record<string, never>, Array<WithTypename<UserStudentGrades> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<UserStudentGradesConnection>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<UserStudentGradesConnection>, Record<string, never>, Scalars['Int'] | string>
  }
};

export type GraphCacheOptimisticUpdaters = {
  acceptInvite?: GraphCacheOptimisticMutationResolver<MutationAcceptInviteArgs, WithTypename<SignInPayload>>,
  addFileShare?: GraphCacheOptimisticMutationResolver<MutationAddFileShareArgs, WithTypename<File>>,
  addUserToChat?: GraphCacheOptimisticMutationResolver<MutationAddUserToChatArgs, WithTypename<ChatUser>>,
  archiveEntry?: GraphCacheOptimisticMutationResolver<MutationArchiveEntryArgs, WithTypename<Entry>>,
  archiveEvent?: GraphCacheOptimisticMutationResolver<MutationArchiveEventArgs, WithTypename<Event>>,
  archiveTag?: GraphCacheOptimisticMutationResolver<MutationArchiveTagArgs, WithTypename<Tag>>,
  archiveUser?: GraphCacheOptimisticMutationResolver<MutationArchiveUserArgs, WithTypename<User>>,
  archiveUserCompetence?: GraphCacheOptimisticMutationResolver<MutationArchiveUserCompetenceArgs, WithTypename<UserCompetence>>,
  copyFile?: GraphCacheOptimisticMutationResolver<MutationCopyFileArgs, WithTypename<File>>,
  copyFiles?: GraphCacheOptimisticMutationResolver<MutationCopyFilesArgs, WithTypename<CopyFilesPayload>>,
  createChat?: GraphCacheOptimisticMutationResolver<MutationCreateChatArgs, WithTypename<Chat>>,
  createCompetence?: GraphCacheOptimisticMutationResolver<MutationCreateCompetenceArgs, WithTypename<Competence>>,
  createDomain?: GraphCacheOptimisticMutationResolver<MutationCreateDomainArgs, Maybe<WithTypename<Domain>>>,
  createEmail?: GraphCacheOptimisticMutationResolver<MutationCreateEmailArgs, Maybe<WithTypename<Email>>>,
  createEmailAccount?: GraphCacheOptimisticMutationResolver<MutationCreateEmailAccountArgs, Maybe<WithTypename<EmailAccount>>>,
  createEmailForwarding?: GraphCacheOptimisticMutationResolver<MutationCreateEmailForwardingArgs, Maybe<WithTypename<EmailForwarding>>>,
  createEmailGroup?: GraphCacheOptimisticMutationResolver<MutationCreateEmailGroupArgs, Maybe<WithTypename<EmailAccount>>>,
  createEmailGroupMember?: GraphCacheOptimisticMutationResolver<MutationCreateEmailGroupMemberArgs, Maybe<WithTypename<EmailGroupMember>>>,
  createEntry?: GraphCacheOptimisticMutationResolver<Record<string, never>, WithTypename<Entry>>,
  createEntryCompetence?: GraphCacheOptimisticMutationResolver<MutationCreateEntryCompetenceArgs, WithTypename<Entry>>,
  createEntryEvent?: GraphCacheOptimisticMutationResolver<MutationCreateEntryEventArgs, WithTypename<Entry>>,
  createEntryFile?: GraphCacheOptimisticMutationResolver<MutationCreateEntryFileArgs, WithTypename<Entry>>,
  createEntryTag?: GraphCacheOptimisticMutationResolver<MutationCreateEntryTagArgs, WithTypename<Entry>>,
  createEntryUser?: GraphCacheOptimisticMutationResolver<MutationCreateEntryUserArgs, WithTypename<Entry>>,
  createEvent?: GraphCacheOptimisticMutationResolver<MutationCreateEventArgs, WithTypename<Event>>,
  createFolder?: GraphCacheOptimisticMutationResolver<MutationCreateFolderArgs, WithTypename<File>>,
  createReport?: GraphCacheOptimisticMutationResolver<MutationCreateReportArgs, WithTypename<Report>>,
  createSchoolYear?: GraphCacheOptimisticMutationResolver<MutationCreateSchoolYearArgs, WithTypename<SchoolYear>>,
  createShare?: GraphCacheOptimisticMutationResolver<MutationCreateShareArgs, WithTypename<ShareUser>>,
  createSharedDrive?: GraphCacheOptimisticMutationResolver<MutationCreateSharedDriveArgs, WithTypename<Bucket>>,
  createStudent?: GraphCacheOptimisticMutationResolver<MutationCreateStudentArgs, WithTypename<User>>,
  createSubject?: GraphCacheOptimisticMutationResolver<MutationCreateSubjectArgs, WithTypename<Subject>>,
  createTag?: GraphCacheOptimisticMutationResolver<MutationCreateTagArgs, WithTypename<Tag>>,
  createUser?: GraphCacheOptimisticMutationResolver<MutationCreateUserArgs, WithTypename<User>>,
  createUserCompetence?: GraphCacheOptimisticMutationResolver<MutationCreateUserCompetenceArgs, WithTypename<UserCompetence>>,
  deleteChat?: GraphCacheOptimisticMutationResolver<MutationDeleteChatArgs, WithTypename<Chat>>,
  deleteDomain?: GraphCacheOptimisticMutationResolver<MutationDeleteDomainArgs, Maybe<WithTypename<Domain>>>,
  deleteEmail?: GraphCacheOptimisticMutationResolver<MutationDeleteEmailArgs, Maybe<WithTypename<Email>>>,
  deleteEmailAccount?: GraphCacheOptimisticMutationResolver<MutationDeleteEmailAccountArgs, Maybe<WithTypename<EmailAccount>>>,
  deleteEmailForwarding?: GraphCacheOptimisticMutationResolver<MutationDeleteEmailForwardingArgs, Maybe<WithTypename<EmailForwarding>>>,
  deleteEmailGroup?: GraphCacheOptimisticMutationResolver<MutationDeleteEmailGroupArgs, Maybe<WithTypename<EmailAccount>>>,
  deleteEmailGroupMember?: GraphCacheOptimisticMutationResolver<MutationDeleteEmailGroupMemberArgs, Maybe<WithTypename<EmailGroupMember>>>,
  deleteEntryCompetence?: GraphCacheOptimisticMutationResolver<MutationDeleteEntryCompetenceArgs, WithTypename<Entry>>,
  deleteEntryEvent?: GraphCacheOptimisticMutationResolver<MutationDeleteEntryEventArgs, WithTypename<Entry>>,
  deleteEntryFile?: GraphCacheOptimisticMutationResolver<MutationDeleteEntryFileArgs, WithTypename<Entry>>,
  deleteEntryTag?: GraphCacheOptimisticMutationResolver<MutationDeleteEntryTagArgs, WithTypename<Entry>>,
  deleteEntryUser?: GraphCacheOptimisticMutationResolver<MutationDeleteEntryUserArgs, WithTypename<Entry>>,
  deleteFile?: GraphCacheOptimisticMutationResolver<MutationDeleteFileArgs, WithTypename<DeleteFilePayload>>,
  deleteFiles?: GraphCacheOptimisticMutationResolver<MutationDeleteFilesArgs, WithTypename<DeleteFilesPayload>>,
  deleteSchoolYear?: GraphCacheOptimisticMutationResolver<MutationDeleteSchoolYearArgs, WithTypename<SchoolYear>>,
  deleteShare?: GraphCacheOptimisticMutationResolver<MutationDeleteShareArgs, WithTypename<ShareUser>>,
  deleteSharedDrive?: GraphCacheOptimisticMutationResolver<MutationDeleteSharedDriveArgs, WithTypename<Bucket>>,
  deleteSubject?: GraphCacheOptimisticMutationResolver<MutationDeleteSubjectArgs, WithTypename<Subject>>,
  downloadFile?: GraphCacheOptimisticMutationResolver<MutationDownloadFileArgs, WithTypename<DownloadFilePayload>>,
  downloadFiles?: GraphCacheOptimisticMutationResolver<MutationDownloadFilesArgs, WithTypename<DownloadFilesPayload>>,
  editShare?: GraphCacheOptimisticMutationResolver<MutationEditShareArgs, WithTypename<ShareUser>>,
  forgotPassword?: GraphCacheOptimisticMutationResolver<MutationForgotPasswordArgs, WithTypename<ForgotPasswordPayload>>,
  importStudents?: GraphCacheOptimisticMutationResolver<MutationImportStudentsArgs, WithTypename<ImportStudentsPayload>>,
  moveFile?: GraphCacheOptimisticMutationResolver<MutationMoveFileArgs, WithTypename<File>>,
  moveFiles?: GraphCacheOptimisticMutationResolver<MutationMoveFilesArgs, WithTypename<MoveFilesPayload>>,
  previewFile?: GraphCacheOptimisticMutationResolver<MutationPreviewFileArgs, WithTypename<PreviewFilePayload>>,
  removeFileShare?: GraphCacheOptimisticMutationResolver<MutationRemoveFileShareArgs, WithTypename<File>>,
  removeUserFromChat?: GraphCacheOptimisticMutationResolver<MutationRemoveUserFromChatArgs, WithTypename<ChatUser>>,
  renameFile?: GraphCacheOptimisticMutationResolver<MutationRenameFileArgs, WithTypename<File>>,
  renameSharedDrive?: GraphCacheOptimisticMutationResolver<MutationRenameSharedDriveArgs, WithTypename<Bucket>>,
  resetPassword?: GraphCacheOptimisticMutationResolver<MutationResetPasswordArgs, WithTypename<ResetPasswordPayload>>,
  sendMessage?: GraphCacheOptimisticMutationResolver<MutationSendMessageArgs, WithTypename<ChatMessage>>,
  sendUserInvite?: GraphCacheOptimisticMutationResolver<MutationSendUserInviteArgs, Scalars['Boolean']>,
  setUserAttendanceState?: GraphCacheOptimisticMutationResolver<MutationSetUserAttendanceStateArgs, WithTypename<UserAttendance>>,
  signIn?: GraphCacheOptimisticMutationResolver<MutationSignInArgs, WithTypename<SignInPayload>>,
  signOut?: GraphCacheOptimisticMutationResolver<Record<string, never>, Scalars['Boolean']>,
  toggleEventCompetence?: GraphCacheOptimisticMutationResolver<MutationToggleEventCompetenceArgs, WithTypename<Event>>,
  updateChat?: GraphCacheOptimisticMutationResolver<MutationUpdateChatArgs, WithTypename<Chat>>,
  updateCompetence?: GraphCacheOptimisticMutationResolver<MutationUpdateCompetenceArgs, WithTypename<Competence>>,
  updateCompetenceSorting?: GraphCacheOptimisticMutationResolver<MutationUpdateCompetenceSortingArgs, Array<WithTypename<Competence>>>,
  updateDailyAttendance?: GraphCacheOptimisticMutationResolver<MutationUpdateDailyAttendanceArgs, Array<WithTypename<UserAttendance>>>,
  updateEmailAccount?: GraphCacheOptimisticMutationResolver<MutationUpdateEmailAccountArgs, Maybe<WithTypename<EmailAccount>>>,
  updateEmailGroup?: GraphCacheOptimisticMutationResolver<MutationUpdateEmailGroupArgs, Maybe<WithTypename<EmailAccount>>>,
  updateEntry?: GraphCacheOptimisticMutationResolver<MutationUpdateEntryArgs, WithTypename<Entry>>,
  updateEntryUserCompetenceLevel?: GraphCacheOptimisticMutationResolver<MutationUpdateEntryUserCompetenceLevelArgs, WithTypename<Entry>>,
  updateEvent?: GraphCacheOptimisticMutationResolver<MutationUpdateEventArgs, WithTypename<Event>>,
  updateOrganisation?: GraphCacheOptimisticMutationResolver<MutationUpdateOrganisationArgs, WithTypename<Organisation>>,
  updatePassword?: GraphCacheOptimisticMutationResolver<MutationUpdatePasswordArgs, Scalars['Boolean']>,
  updateSchoolYear?: GraphCacheOptimisticMutationResolver<MutationUpdateSchoolYearArgs, WithTypename<SchoolYear>>,
  updateSubject?: GraphCacheOptimisticMutationResolver<MutationUpdateSubjectArgs, WithTypename<Subject>>,
  updateTag?: GraphCacheOptimisticMutationResolver<MutationUpdateTagArgs, WithTypename<Tag>>,
  updateUser?: GraphCacheOptimisticMutationResolver<MutationUpdateUserArgs, WithTypename<User>>,
  updateUserLanguage?: GraphCacheOptimisticMutationResolver<MutationUpdateUserLanguageArgs, WithTypename<User>>,
  updateUserStudentGrade?: GraphCacheOptimisticMutationResolver<MutationUpdateUserStudentGradeArgs, WithTypename<UserStudentGrades>>,
  uploadFile?: GraphCacheOptimisticMutationResolver<MutationUploadFileArgs, WithTypename<File>>,
  uploadFiles?: GraphCacheOptimisticMutationResolver<MutationUploadFilesArgs, WithTypename<UploadFilesPayload>>
};

export type GraphCacheUpdaters = {
  Query?: {
    EmailGroupMember?: GraphCacheUpdateResolver<{ EmailGroupMember: Maybe<WithTypename<EmailGroupMember>> }, QueryEmailGroupMemberArgs>,
    EmailGroupMembers?: GraphCacheUpdateResolver<{ EmailGroupMembers: Maybe<WithTypename<EmailGroupMemberConnection>> }, Record<string, never>>,
    bucket?: GraphCacheUpdateResolver<{ bucket: WithTypename<Bucket> }, QueryBucketArgs>,
    buckets?: GraphCacheUpdateResolver<{ buckets: WithTypename<BucketConnection> }, QueryBucketsArgs>,
    chat?: GraphCacheUpdateResolver<{ chat: WithTypename<Chat> }, QueryChatArgs>,
    chats?: GraphCacheUpdateResolver<{ chats: WithTypename<ChatConnection> }, QueryChatsArgs>,
    competence?: GraphCacheUpdateResolver<{ competence: WithTypename<Competence> }, QueryCompetenceArgs>,
    competences?: GraphCacheUpdateResolver<{ competences: WithTypename<CompetenceConnection> }, QueryCompetencesArgs>,
    domain?: GraphCacheUpdateResolver<{ domain: Maybe<WithTypename<Domain>> }, QueryDomainArgs>,
    domains?: GraphCacheUpdateResolver<{ domains: Maybe<WithTypename<DomainConnection>> }, Record<string, never>>,
    email?: GraphCacheUpdateResolver<{ email: Maybe<WithTypename<Email>> }, QueryEmailArgs>,
    emailAccount?: GraphCacheUpdateResolver<{ emailAccount: Maybe<WithTypename<EmailAccount>> }, QueryEmailAccountArgs>,
    emailAccounts?: GraphCacheUpdateResolver<{ emailAccounts: Maybe<WithTypename<EmailAccountConnection>> }, QueryEmailAccountsArgs>,
    emailForwarding?: GraphCacheUpdateResolver<{ emailForwarding: Maybe<WithTypename<EmailForwarding>> }, QueryEmailForwardingArgs>,
    emailForwardings?: GraphCacheUpdateResolver<{ emailForwardings: Maybe<WithTypename<EmailForwardingConnection>> }, Record<string, never>>,
    emails?: GraphCacheUpdateResolver<{ emails: Maybe<WithTypename<EmailConnection>> }, Record<string, never>>,
    entries?: GraphCacheUpdateResolver<{ entries: WithTypename<EntryConnection> }, QueryEntriesArgs>,
    entry?: GraphCacheUpdateResolver<{ entry: WithTypename<Entry> }, QueryEntryArgs>,
    event?: GraphCacheUpdateResolver<{ event: WithTypename<Event> }, QueryEventArgs>,
    events?: GraphCacheUpdateResolver<{ events: WithTypename<EventConnection> }, QueryEventsArgs>,
    exportEvents?: GraphCacheUpdateResolver<{ exportEvents: Array<WithTypename<ExportEventsPayload>> }, QueryExportEventsArgs>,
    file?: GraphCacheUpdateResolver<{ file: WithTypename<File> }, QueryFileArgs>,
    files?: GraphCacheUpdateResolver<{ files: WithTypename<FileConnection> }, QueryFilesArgs>,
    inviteDetails?: GraphCacheUpdateResolver<{ inviteDetails: WithTypename<InviteDetailsPayload> }, QueryInviteDetailsArgs>,
    me?: GraphCacheUpdateResolver<{ me: WithTypename<User> }, Record<string, never>>,
    organisation?: GraphCacheUpdateResolver<{ organisation: Maybe<WithTypename<Organisation>> }, Record<string, never>>,
    report?: GraphCacheUpdateResolver<{ report: WithTypename<Report> }, QueryReportArgs>,
    reports?: GraphCacheUpdateResolver<{ reports: WithTypename<ReportConnection> }, QueryReportsArgs>,
    schoolYear?: GraphCacheUpdateResolver<{ schoolYear: WithTypename<SchoolYear> }, QuerySchoolYearArgs>,
    schoolYears?: GraphCacheUpdateResolver<{ schoolYears: WithTypename<SchoolYearConnection> }, QuerySchoolYearsArgs>,
    shares?: GraphCacheUpdateResolver<{ shares: Maybe<Array<WithTypename<ShareUser>>> }, QuerySharesArgs>,
    subject?: GraphCacheUpdateResolver<{ subject: WithTypename<Subject> }, QuerySubjectArgs>,
    subjects?: GraphCacheUpdateResolver<{ subjects: WithTypename<SubjectConnection> }, QuerySubjectsArgs>,
    tag?: GraphCacheUpdateResolver<{ tag: WithTypename<Tag> }, QueryTagArgs>,
    tags?: GraphCacheUpdateResolver<{ tags: WithTypename<TagConnection> }, QueryTagsArgs>,
    user?: GraphCacheUpdateResolver<{ user: WithTypename<User> }, QueryUserArgs>,
    userAttendanceOverview?: GraphCacheUpdateResolver<{ userAttendanceOverview: Array<WithTypename<UserAttendance>> }, QueryUserAttendanceOverviewArgs>,
    userStudent?: GraphCacheUpdateResolver<{ userStudent: WithTypename<UserStudent> }, QueryUserStudentArgs>,
    userStudentGrade?: GraphCacheUpdateResolver<{ userStudentGrade: WithTypename<UserStudentGrades> }, QueryUserStudentGradeArgs>,
    userStudentGrades?: GraphCacheUpdateResolver<{ userStudentGrades: WithTypename<UserStudentGradesConnection> }, QueryUserStudentGradesArgs>,
    userStudents?: GraphCacheUpdateResolver<{ userStudents: WithTypename<UserStudentConnection> }, QueryUserStudentsArgs>,
    users?: GraphCacheUpdateResolver<{ users: WithTypename<UserConnection> }, QueryUsersArgs>
  },
  Mutation?: {
    acceptInvite?: GraphCacheUpdateResolver<{ acceptInvite: WithTypename<SignInPayload> }, MutationAcceptInviteArgs>,
    addFileShare?: GraphCacheUpdateResolver<{ addFileShare: WithTypename<File> }, MutationAddFileShareArgs>,
    addUserToChat?: GraphCacheUpdateResolver<{ addUserToChat: WithTypename<ChatUser> }, MutationAddUserToChatArgs>,
    archiveEntry?: GraphCacheUpdateResolver<{ archiveEntry: WithTypename<Entry> }, MutationArchiveEntryArgs>,
    archiveEvent?: GraphCacheUpdateResolver<{ archiveEvent: WithTypename<Event> }, MutationArchiveEventArgs>,
    archiveTag?: GraphCacheUpdateResolver<{ archiveTag: WithTypename<Tag> }, MutationArchiveTagArgs>,
    archiveUser?: GraphCacheUpdateResolver<{ archiveUser: WithTypename<User> }, MutationArchiveUserArgs>,
    archiveUserCompetence?: GraphCacheUpdateResolver<{ archiveUserCompetence: WithTypename<UserCompetence> }, MutationArchiveUserCompetenceArgs>,
    copyFile?: GraphCacheUpdateResolver<{ copyFile: WithTypename<File> }, MutationCopyFileArgs>,
    copyFiles?: GraphCacheUpdateResolver<{ copyFiles: WithTypename<CopyFilesPayload> }, MutationCopyFilesArgs>,
    createChat?: GraphCacheUpdateResolver<{ createChat: WithTypename<Chat> }, MutationCreateChatArgs>,
    createCompetence?: GraphCacheUpdateResolver<{ createCompetence: WithTypename<Competence> }, MutationCreateCompetenceArgs>,
    createDomain?: GraphCacheUpdateResolver<{ createDomain: Maybe<WithTypename<Domain>> }, MutationCreateDomainArgs>,
    createEmail?: GraphCacheUpdateResolver<{ createEmail: Maybe<WithTypename<Email>> }, MutationCreateEmailArgs>,
    createEmailAccount?: GraphCacheUpdateResolver<{ createEmailAccount: Maybe<WithTypename<EmailAccount>> }, MutationCreateEmailAccountArgs>,
    createEmailForwarding?: GraphCacheUpdateResolver<{ createEmailForwarding: Maybe<WithTypename<EmailForwarding>> }, MutationCreateEmailForwardingArgs>,
    createEmailGroup?: GraphCacheUpdateResolver<{ createEmailGroup: Maybe<WithTypename<EmailAccount>> }, MutationCreateEmailGroupArgs>,
    createEmailGroupMember?: GraphCacheUpdateResolver<{ createEmailGroupMember: Maybe<WithTypename<EmailGroupMember>> }, MutationCreateEmailGroupMemberArgs>,
    createEntry?: GraphCacheUpdateResolver<{ createEntry: WithTypename<Entry> }, Record<string, never>>,
    createEntryCompetence?: GraphCacheUpdateResolver<{ createEntryCompetence: WithTypename<Entry> }, MutationCreateEntryCompetenceArgs>,
    createEntryEvent?: GraphCacheUpdateResolver<{ createEntryEvent: WithTypename<Entry> }, MutationCreateEntryEventArgs>,
    createEntryFile?: GraphCacheUpdateResolver<{ createEntryFile: WithTypename<Entry> }, MutationCreateEntryFileArgs>,
    createEntryTag?: GraphCacheUpdateResolver<{ createEntryTag: WithTypename<Entry> }, MutationCreateEntryTagArgs>,
    createEntryUser?: GraphCacheUpdateResolver<{ createEntryUser: WithTypename<Entry> }, MutationCreateEntryUserArgs>,
    createEvent?: GraphCacheUpdateResolver<{ createEvent: WithTypename<Event> }, MutationCreateEventArgs>,
    createFolder?: GraphCacheUpdateResolver<{ createFolder: WithTypename<File> }, MutationCreateFolderArgs>,
    createReport?: GraphCacheUpdateResolver<{ createReport: WithTypename<Report> }, MutationCreateReportArgs>,
    createSchoolYear?: GraphCacheUpdateResolver<{ createSchoolYear: WithTypename<SchoolYear> }, MutationCreateSchoolYearArgs>,
    createShare?: GraphCacheUpdateResolver<{ createShare: WithTypename<ShareUser> }, MutationCreateShareArgs>,
    createSharedDrive?: GraphCacheUpdateResolver<{ createSharedDrive: WithTypename<Bucket> }, MutationCreateSharedDriveArgs>,
    createStudent?: GraphCacheUpdateResolver<{ createStudent: WithTypename<User> }, MutationCreateStudentArgs>,
    createSubject?: GraphCacheUpdateResolver<{ createSubject: WithTypename<Subject> }, MutationCreateSubjectArgs>,
    createTag?: GraphCacheUpdateResolver<{ createTag: WithTypename<Tag> }, MutationCreateTagArgs>,
    createUser?: GraphCacheUpdateResolver<{ createUser: WithTypename<User> }, MutationCreateUserArgs>,
    createUserCompetence?: GraphCacheUpdateResolver<{ createUserCompetence: WithTypename<UserCompetence> }, MutationCreateUserCompetenceArgs>,
    deleteChat?: GraphCacheUpdateResolver<{ deleteChat: WithTypename<Chat> }, MutationDeleteChatArgs>,
    deleteDomain?: GraphCacheUpdateResolver<{ deleteDomain: Maybe<WithTypename<Domain>> }, MutationDeleteDomainArgs>,
    deleteEmail?: GraphCacheUpdateResolver<{ deleteEmail: Maybe<WithTypename<Email>> }, MutationDeleteEmailArgs>,
    deleteEmailAccount?: GraphCacheUpdateResolver<{ deleteEmailAccount: Maybe<WithTypename<EmailAccount>> }, MutationDeleteEmailAccountArgs>,
    deleteEmailForwarding?: GraphCacheUpdateResolver<{ deleteEmailForwarding: Maybe<WithTypename<EmailForwarding>> }, MutationDeleteEmailForwardingArgs>,
    deleteEmailGroup?: GraphCacheUpdateResolver<{ deleteEmailGroup: Maybe<WithTypename<EmailAccount>> }, MutationDeleteEmailGroupArgs>,
    deleteEmailGroupMember?: GraphCacheUpdateResolver<{ deleteEmailGroupMember: Maybe<WithTypename<EmailGroupMember>> }, MutationDeleteEmailGroupMemberArgs>,
    deleteEntryCompetence?: GraphCacheUpdateResolver<{ deleteEntryCompetence: WithTypename<Entry> }, MutationDeleteEntryCompetenceArgs>,
    deleteEntryEvent?: GraphCacheUpdateResolver<{ deleteEntryEvent: WithTypename<Entry> }, MutationDeleteEntryEventArgs>,
    deleteEntryFile?: GraphCacheUpdateResolver<{ deleteEntryFile: WithTypename<Entry> }, MutationDeleteEntryFileArgs>,
    deleteEntryTag?: GraphCacheUpdateResolver<{ deleteEntryTag: WithTypename<Entry> }, MutationDeleteEntryTagArgs>,
    deleteEntryUser?: GraphCacheUpdateResolver<{ deleteEntryUser: WithTypename<Entry> }, MutationDeleteEntryUserArgs>,
    deleteFile?: GraphCacheUpdateResolver<{ deleteFile: WithTypename<DeleteFilePayload> }, MutationDeleteFileArgs>,
    deleteFiles?: GraphCacheUpdateResolver<{ deleteFiles: WithTypename<DeleteFilesPayload> }, MutationDeleteFilesArgs>,
    deleteSchoolYear?: GraphCacheUpdateResolver<{ deleteSchoolYear: WithTypename<SchoolYear> }, MutationDeleteSchoolYearArgs>,
    deleteShare?: GraphCacheUpdateResolver<{ deleteShare: WithTypename<ShareUser> }, MutationDeleteShareArgs>,
    deleteSharedDrive?: GraphCacheUpdateResolver<{ deleteSharedDrive: WithTypename<Bucket> }, MutationDeleteSharedDriveArgs>,
    deleteSubject?: GraphCacheUpdateResolver<{ deleteSubject: WithTypename<Subject> }, MutationDeleteSubjectArgs>,
    downloadFile?: GraphCacheUpdateResolver<{ downloadFile: WithTypename<DownloadFilePayload> }, MutationDownloadFileArgs>,
    downloadFiles?: GraphCacheUpdateResolver<{ downloadFiles: WithTypename<DownloadFilesPayload> }, MutationDownloadFilesArgs>,
    editShare?: GraphCacheUpdateResolver<{ editShare: WithTypename<ShareUser> }, MutationEditShareArgs>,
    forgotPassword?: GraphCacheUpdateResolver<{ forgotPassword: WithTypename<ForgotPasswordPayload> }, MutationForgotPasswordArgs>,
    importStudents?: GraphCacheUpdateResolver<{ importStudents: WithTypename<ImportStudentsPayload> }, MutationImportStudentsArgs>,
    moveFile?: GraphCacheUpdateResolver<{ moveFile: WithTypename<File> }, MutationMoveFileArgs>,
    moveFiles?: GraphCacheUpdateResolver<{ moveFiles: WithTypename<MoveFilesPayload> }, MutationMoveFilesArgs>,
    previewFile?: GraphCacheUpdateResolver<{ previewFile: WithTypename<PreviewFilePayload> }, MutationPreviewFileArgs>,
    removeFileShare?: GraphCacheUpdateResolver<{ removeFileShare: WithTypename<File> }, MutationRemoveFileShareArgs>,
    removeUserFromChat?: GraphCacheUpdateResolver<{ removeUserFromChat: WithTypename<ChatUser> }, MutationRemoveUserFromChatArgs>,
    renameFile?: GraphCacheUpdateResolver<{ renameFile: WithTypename<File> }, MutationRenameFileArgs>,
    renameSharedDrive?: GraphCacheUpdateResolver<{ renameSharedDrive: WithTypename<Bucket> }, MutationRenameSharedDriveArgs>,
    resetPassword?: GraphCacheUpdateResolver<{ resetPassword: WithTypename<ResetPasswordPayload> }, MutationResetPasswordArgs>,
    sendMessage?: GraphCacheUpdateResolver<{ sendMessage: WithTypename<ChatMessage> }, MutationSendMessageArgs>,
    sendUserInvite?: GraphCacheUpdateResolver<{ sendUserInvite: Scalars['Boolean'] }, MutationSendUserInviteArgs>,
    setUserAttendanceState?: GraphCacheUpdateResolver<{ setUserAttendanceState: WithTypename<UserAttendance> }, MutationSetUserAttendanceStateArgs>,
    signIn?: GraphCacheUpdateResolver<{ signIn: WithTypename<SignInPayload> }, MutationSignInArgs>,
    signOut?: GraphCacheUpdateResolver<{ signOut: Scalars['Boolean'] }, Record<string, never>>,
    toggleEventCompetence?: GraphCacheUpdateResolver<{ toggleEventCompetence: WithTypename<Event> }, MutationToggleEventCompetenceArgs>,
    updateChat?: GraphCacheUpdateResolver<{ updateChat: WithTypename<Chat> }, MutationUpdateChatArgs>,
    updateCompetence?: GraphCacheUpdateResolver<{ updateCompetence: WithTypename<Competence> }, MutationUpdateCompetenceArgs>,
    updateCompetenceSorting?: GraphCacheUpdateResolver<{ updateCompetenceSorting: Array<WithTypename<Competence>> }, MutationUpdateCompetenceSortingArgs>,
    updateDailyAttendance?: GraphCacheUpdateResolver<{ updateDailyAttendance: Array<WithTypename<UserAttendance>> }, MutationUpdateDailyAttendanceArgs>,
    updateEmailAccount?: GraphCacheUpdateResolver<{ updateEmailAccount: Maybe<WithTypename<EmailAccount>> }, MutationUpdateEmailAccountArgs>,
    updateEmailGroup?: GraphCacheUpdateResolver<{ updateEmailGroup: Maybe<WithTypename<EmailAccount>> }, MutationUpdateEmailGroupArgs>,
    updateEntry?: GraphCacheUpdateResolver<{ updateEntry: WithTypename<Entry> }, MutationUpdateEntryArgs>,
    updateEntryUserCompetenceLevel?: GraphCacheUpdateResolver<{ updateEntryUserCompetenceLevel: WithTypename<Entry> }, MutationUpdateEntryUserCompetenceLevelArgs>,
    updateEvent?: GraphCacheUpdateResolver<{ updateEvent: WithTypename<Event> }, MutationUpdateEventArgs>,
    updateOrganisation?: GraphCacheUpdateResolver<{ updateOrganisation: WithTypename<Organisation> }, MutationUpdateOrganisationArgs>,
    updatePassword?: GraphCacheUpdateResolver<{ updatePassword: Scalars['Boolean'] }, MutationUpdatePasswordArgs>,
    updateSchoolYear?: GraphCacheUpdateResolver<{ updateSchoolYear: WithTypename<SchoolYear> }, MutationUpdateSchoolYearArgs>,
    updateSubject?: GraphCacheUpdateResolver<{ updateSubject: WithTypename<Subject> }, MutationUpdateSubjectArgs>,
    updateTag?: GraphCacheUpdateResolver<{ updateTag: WithTypename<Tag> }, MutationUpdateTagArgs>,
    updateUser?: GraphCacheUpdateResolver<{ updateUser: WithTypename<User> }, MutationUpdateUserArgs>,
    updateUserLanguage?: GraphCacheUpdateResolver<{ updateUserLanguage: WithTypename<User> }, MutationUpdateUserLanguageArgs>,
    updateUserStudentGrade?: GraphCacheUpdateResolver<{ updateUserStudentGrade: WithTypename<UserStudentGrades> }, MutationUpdateUserStudentGradeArgs>,
    uploadFile?: GraphCacheUpdateResolver<{ uploadFile: WithTypename<File> }, MutationUploadFileArgs>,
    uploadFiles?: GraphCacheUpdateResolver<{ uploadFiles: WithTypename<UploadFilesPayload> }, MutationUploadFilesArgs>
  },
  Subscription?: {
    messageAdded?: GraphCacheUpdateResolver<{ messageAdded: WithTypename<ChatMessage> }, SubscriptionMessageAddedArgs>
  },
  Bucket?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Bucket>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Bucket>>, Record<string, never>>,
    files?: GraphCacheUpdateResolver<Maybe<WithTypename<Bucket>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Bucket>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<Bucket>>, Record<string, never>>,
    permission?: GraphCacheUpdateResolver<Maybe<WithTypename<Bucket>>, Record<string, never>>,
    shared?: GraphCacheUpdateResolver<Maybe<WithTypename<Bucket>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<Bucket>>, Record<string, never>>
  },
  BucketConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<BucketConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<BucketConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<BucketConnection>>, Record<string, never>>
  },
  Chat?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    lastMessage?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    messages?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
    type?: GraphCacheUpdateResolver<Maybe<WithTypename<Chat>>, Record<string, never>>,
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
    message?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatMessage>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatMessage>>, Record<string, never>>
  },
  ChatUser?: {
    chat?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatUser>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatUser>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatUser>>, Record<string, never>>,
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
  CopyFilesPayload?: {
    files?: GraphCacheUpdateResolver<Maybe<WithTypename<CopyFilesPayload>>, Record<string, never>>
  },
  DeleteFilePayload?: {
    file?: GraphCacheUpdateResolver<Maybe<WithTypename<DeleteFilePayload>>, Record<string, never>>,
    success?: GraphCacheUpdateResolver<Maybe<WithTypename<DeleteFilePayload>>, Record<string, never>>
  },
  DeleteFilesPayload?: {
    files?: GraphCacheUpdateResolver<Maybe<WithTypename<DeleteFilesPayload>>, Record<string, never>>,
    success?: GraphCacheUpdateResolver<Maybe<WithTypename<DeleteFilesPayload>>, Record<string, never>>
  },
  Domain?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Domain>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Domain>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<Domain>>, Record<string, never>>
  },
  DomainConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<DomainConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<DomainConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<DomainConnection>>, Record<string, never>>
  },
  DownloadFilePayload?: {
    url?: GraphCacheUpdateResolver<Maybe<WithTypename<DownloadFilePayload>>, Record<string, never>>
  },
  DownloadFilesPayload?: {
    url?: GraphCacheUpdateResolver<Maybe<WithTypename<DownloadFilesPayload>>, Record<string, never>>
  },
  Email?: {
    address?: GraphCacheUpdateResolver<Maybe<WithTypename<Email>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Email>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Email>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<Email>>, Record<string, never>>,
    type?: GraphCacheUpdateResolver<Maybe<WithTypename<Email>>, Record<string, never>>
  },
  EmailAccount?: {
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailAccount>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailAccount>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailAccount>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailAccount>>, Record<string, never>>,
    members?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailAccount>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailAccount>>, Record<string, never>>,
    quota?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailAccount>>, Record<string, never>>,
    type?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailAccount>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailAccount>>, Record<string, never>>
  },
  EmailAccountConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailAccountConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailAccountConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailAccountConnection>>, Record<string, never>>
  },
  EmailConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailConnection>>, Record<string, never>>
  },
  EmailForwarding?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailForwarding>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailForwarding>>, Record<string, never>>,
    origin?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailForwarding>>, Record<string, never>>,
    target?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailForwarding>>, Record<string, never>>
  },
  EmailForwardingConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailForwardingConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailForwardingConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailForwardingConnection>>, Record<string, never>>
  },
  EmailGroupMember?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailGroupMember>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailGroupMember>>, Record<string, never>>,
    memberOf?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailGroupMember>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailGroupMember>>, Record<string, never>>
  },
  EmailGroupMemberConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailGroupMemberConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailGroupMemberConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<EmailGroupMemberConnection>>, Record<string, never>>
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
    MIMEType?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    bucket?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    fileType?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    files?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    parent?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    parents?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>,
    size?: GraphCacheUpdateResolver<Maybe<WithTypename<File>>, Record<string, never>>
  },
  FileConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<FileConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<FileConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<FileConnection>>, Record<string, never>>
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
  MoveFilesPayload?: {
    files?: GraphCacheUpdateResolver<Maybe<WithTypename<MoveFilesPayload>>, Record<string, never>>
  },
  Organisation?: {
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
  PreviewFilePayload?: {
    url?: GraphCacheUpdateResolver<Maybe<WithTypename<PreviewFilePayload>>, Record<string, never>>
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
    invalidToken?: GraphCacheUpdateResolver<Maybe<WithTypename<ResetPasswordPayload>>, Record<string, never>>,
    success?: GraphCacheUpdateResolver<Maybe<WithTypename<ResetPasswordPayload>>, Record<string, never>>,
    tokenExpired?: GraphCacheUpdateResolver<Maybe<WithTypename<ResetPasswordPayload>>, Record<string, never>>,
    unableToReset?: GraphCacheUpdateResolver<Maybe<WithTypename<ResetPasswordPayload>>, Record<string, never>>,
    unauthorized?: GraphCacheUpdateResolver<Maybe<WithTypename<ResetPasswordPayload>>, Record<string, never>>
  },
  SchoolYear?: {
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<SchoolYear>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<SchoolYear>>, Record<string, never>>,
    year?: GraphCacheUpdateResolver<Maybe<WithTypename<SchoolYear>>, Record<string, never>>
  },
  SchoolYearConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<SchoolYearConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<SchoolYearConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<SchoolYearConnection>>, Record<string, never>>
  },
  ShareUser?: {
    permission?: GraphCacheUpdateResolver<Maybe<WithTypename<ShareUser>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<ShareUser>>, Record<string, never>>
  },
  SignInPayload?: {
    enabled_apps?: GraphCacheUpdateResolver<Maybe<WithTypename<SignInPayload>>, Record<string, never>>,
    language?: GraphCacheUpdateResolver<Maybe<WithTypename<SignInPayload>>, Record<string, never>>,
    setupComplete?: GraphCacheUpdateResolver<Maybe<WithTypename<SignInPayload>>, Record<string, never>>,
    token?: GraphCacheUpdateResolver<Maybe<WithTypename<SignInPayload>>, Record<string, never>>
  },
  Subject?: {
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Subject>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<Subject>>, Record<string, never>>
  },
  SubjectConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<SubjectConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<SubjectConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<SubjectConnection>>, Record<string, never>>
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
  UploadFilesPayload?: {
    files?: GraphCacheUpdateResolver<Maybe<WithTypename<UploadFilesPayload>>, Record<string, never>>
  },
  User?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    deletedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    email?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    emailAccounts?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    firstName?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    inviteAccepted?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    language?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    lastName?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
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
    nationality?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudent>>, Record<string, never>>
  },
  UserStudentConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentConnection>>, Record<string, never>>
  },
  UserStudentGrades?: {
    grade?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentGrades>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentGrades>>, Record<string, never>>,
    schoolYear?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentGrades>>, Record<string, never>>,
    student?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentGrades>>, Record<string, never>>,
    subject?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentGrades>>, Record<string, never>>
  },
  UserStudentGradesConnection?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentGradesConnection>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentGradesConnection>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<UserStudentGradesConnection>>, Record<string, never>>
  },
};

export type GraphCacheConfig = Parameters<typeof cacheExchange>[0] & {
  updates?: GraphCacheUpdaters,
  keys?: GraphCacheKeysConfig,
  optimistic?: GraphCacheOptimisticUpdaters,
  resolvers?: GraphCacheResolvers,
};
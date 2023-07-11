/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    mutation signOut {\n      signOut\n    }\n  ": types.SignOutDocument,
    "\n    mutation updateUserLanguage($language: UserLanguage!) {\n      updateUserLanguage(language: $language) {\n        id\n        language\n      }\n    }\n  ": types.UpdateUserLanguageDocument,
    "\n    query competenceSearch($search: String, $filter: CompetenceFilterInput) {\n      competences(search: $search, filter: $filter, sort: { field: sort_order, order: asc }) {\n        edges {\n          id\n          name\n          type\n          color\n          grades\n          parents {\n            id\n            name\n            type\n            grades\n            color\n          }\n        }\n      }\n    }\n  ": types.CompetenceSearchDocument,
    "\n    query competencePath($id: ID!) {\n      competence(id: $id) {\n        id\n        name\n        type\n        color\n        grades\n        parents {\n          id\n          name\n          type\n          grades\n          color\n        }\n      }\n    }\n  ": types.CompetencePathDocument,
    "\n    mutation previewFile($id: ID!) {\n      previewFile(input: { id: $id }) {\n        url\n      }\n    }\n  ": types.PreviewFileDocument,
    "\n    query adminStudentById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        role\n        student {\n          id\n          grade\n          birthday\n          joinedAt\n          leftAt\n        }\n      }\n    }\n  ": types.AdminStudentByIdDocument,
    "\n    mutation updateStudent($student: UpdateUserInput!) {\n      updateUser(input: $student) {\n        id\n        firstName\n        lastName\n        role\n        student {\n          id\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  ": types.UpdateStudentDocument,
    "\n    mutation archiveStudent($id: ID!) {\n      archiveUser(id: $id) {\n        id\n        firstName\n        lastName\n        role\n        student {\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  ": types.ArchiveStudentDocument,
    "\n  query adminStudents($search: String, $order: UserOrderBy, $offset: Int) {\n    users(filter: { role: [student], orderBy: $order }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n        }\n      }\n    }\n  }\n": types.AdminStudentsDocument,
    "\n    mutation createStudent($student: CreateStudentInput!) {\n      createStudent(input: $student) {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  ": types.CreateStudentDocument,
    "\n    query adminUserById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        email\n        role\n      }\n    }\n  ": types.AdminUserByIdDocument,
    "\n    mutation updateUser($input: UpdateUserInput!) {\n      updateUser(input: $input) {\n        id\n        firstName\n        lastName\n        email\n        role\n      }\n    }\n  ": types.UpdateUserDocument,
    "\n    mutation archiveUser($id: ID!) {\n      archiveUser(id: $id) {\n        id\n        firstName\n        lastName\n        email\n        role\n      }\n    }\n  ": types.ArchiveUserDocument,
    "\n  query adminUsers($search: String, $order: UserOrderBy, $offset: Int) {\n    users(filter: { role: [owner, admin, teacher], orderBy: $order }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n": types.AdminUsersDocument,
    "\n    mutation createUser($user: CreateUserInput!) {\n      createUser(input: $user) {\n        id\n        firstName\n        lastName\n      }\n    }\n  ": types.CreateUserDocument,
    "\n    mutation deleteFile($id: ID!) {\n      deleteFile(input: { id: $id }) {\n        success\n        file {\n          id\n        }\n      }\n    }\n  ": types.DeleteFileDocument,
    "\n  query files($offset: Int, $limit: Int, $filter: FilesFilterInput) {\n    files(input: $filter, limit: $limit, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        fileType\n        MIMEType\n        size\n        createdAt\n      }\n    }\n  }\n": types.FilesDocument,
    "\n    mutation createFolder($input: CreateFolderInput!) {\n      createFolder(input: $input) {\n        id\n      }\n    }\n  ": types.CreateFolderDocument,
    "\n    query fileById($id: ID!) {\n      file(id: $id) {\n        id\n        name\n        parents {\n          id\n          name\n        }\n      }\n    }\n  ": types.FileByIdDocument,
    "\n    mutation renameFile($input: RenameFileInput!) {\n      renameFile(input: $input) {\n        id\n        name\n      }\n    }\n  ": types.RenameFileDocument,
    "\n    mutation uploadFile($input: FileUploadInput!) {\n      uploadFile(input: $input) {\n        id\n      }\n    }\n  ": types.UploadFileDocument,
    "\n    mutation forgotPassword($input: ForgotPasswordInput!) {\n      forgotPassword(input: $input) {\n        success\n      }\n    }\n  ": types.ForgotPasswordDocument,
    "\n    mutation updateCompetence($input: UpdateCompetenceInput!) {\n      updateCompetence(input: $input) {\n        id\n        name\n        color\n      }\n    }\n  ": types.UpdateCompetenceDocument,
    "\n  query competence($search: String, $limit: Int, $offset: Int, $parent: [ID]) {\n    competences(\n      filter: { parents: $parent }\n      search: $search\n      limit: $limit\n      offset: $offset\n      sort: { field: sort_order, order: asc }\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        type\n        grades\n        color\n        sortOrder\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  }\n": types.CompetenceDocument,
    "\n  query competenceSubjects($search: String, $limit: Int, $offset: Int) {\n    competences(\n      filter: { type: subject }\n      search: $search\n      limit: $limit\n      offset: $offset\n      sort: { field: sort_order, order: asc }\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        type\n        grades\n        color\n        sortOrder\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  }\n": types.CompetenceSubjectsDocument,
    "\n  mutation createEntry($input: CreateEntryInput!) {\n    createEntry(input: $input) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n        }\n      }\n    }\n  }\n": types.CreateEntryDocument,
    "\n  mutation updateEntry($input: UpdateEntryInput!) {\n    updateEntry(input: $input) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n        }\n      }\n    }\n  }\n": types.UpdateEntryDocument,
    "\n    query events {\n      events {\n        edges {\n          id\n          title\n        }\n      }\n    }\n  ": types.EventsDocument,
    "\n    query users($search: String) {\n      users(filter: { role: [student] }, search: $search, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  ": types.UsersDocument,
    "\n    query entryById($id: ID!) {\n      entry(id: $id) {\n        id\n        date\n        body\n        deletedAt\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        tags {\n          id\n          name\n          color\n        }\n        events {\n          id\n          title\n        }\n        users {\n          id\n          firstName\n          lastName\n        }\n        userCompetences {\n          id\n          level\n          competence {\n            id\n            name\n            color\n            type\n            grades\n            parents {\n              id\n              name\n              grades\n              color\n            }\n          }\n        }\n      }\n    }\n  ": types.EntryByIdDocument,
    "\n  query getEntries($filter: EntryFilterInput, $limit: Int, $order: EntrySortBy, $offset: Int) {\n    entries(filter: $filter, limit: $limit, sortBy: $order, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        date\n        body\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        events {\n          id\n          title\n        }\n        tags {\n          id\n          name\n          color\n        }\n      }\n    }\n  }\n": types.GetEntriesDocument,
    "\n    query getEntryFilterStudents {\n      users(filter: { role: [student] }, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  ": types.GetEntryFilterStudentsDocument,
    "\n    query getEntryFilterTeachers {\n      users(filter: { role: [owner, admin, teacher, educator] }, limit: 500) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  ": types.GetEntryFilterTeachersDocument,
    "\n    query getEntryFilterTags {\n      tags(limit: 1000) {\n        edges {\n          id\n          name\n          color\n        }\n      }\n    }\n  ": types.GetEntryFilterTagsDocument,
    "\n    mutation toggleEventCompetence($input: AddEventCompetenceInput!) {\n      toggleEventCompetence(input: $input) {\n        id\n      }\n    }\n  ": types.ToggleEventCompetenceDocument,
    "\n    mutation archiveEvent($id: ID!) {\n      archiveEvent(id: $id) {\n        id\n      }\n    }\n  ": types.ArchiveEventDocument,
    "\n    mutation createEvent($input: CreateEventInput!) {\n      createEvent(input: $input) {\n        id\n        title\n        image {\n          id\n        }\n        body\n        startsAt\n        endsAt\n        recurrence\n        createdAt\n      }\n    }\n  ": types.CreateEventDocument,
    "\n    mutation updateEvent($input: UpdateEventInput!) {\n      updateEvent(input: $input) {\n        id\n        title\n        image {\n          id\n        }\n        body\n        startsAt\n        endsAt\n        recurrence\n        createdAt\n      }\n    }\n  ": types.UpdateEventDocument,
    "\n    query event($id: ID!) {\n      event(id: $id) {\n        id\n        title\n        body\n        createdAt\n        startsAt\n        endsAt\n        competences {\n          id\n          name\n          type\n          grades\n          parents {\n            id\n            name\n            type\n            grades\n          }\n        }\n      }\n    }\n  ": types.EventDocument,
    "\n    query exportEvents($input: ExportEventsInput!) {\n      exportEvents(input: $input) {\n        id\n        title\n        body\n        startsAt\n        endsAt\n        subjects\n      }\n    }\n  ": types.ExportEventsDocument,
    "\n  query eventWithSearch($search: String, $offset: Int, $filter: EventFilterInput) {\n    events(search: $search, limit: 50, offset: $offset, filter: $filter) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        title\n        body\n        createdAt\n        startsAt\n        endsAt\n      }\n    }\n  }\n": types.EventWithSearchDocument,
    "\n    query students {\n      users(filter: { role: [student] }, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n          student {\n            id\n          }\n        }\n      }\n    }\n  ": types.StudentsDocument,
    "\n    query GetTags {\n      tags(limit: 1000) {\n        edges {\n          id\n          name\n          color\n          deletedAt\n          createdAt\n        }\n      }\n    }\n  ": types.GetTagsDocument,
    "\n  query reports {\n    reports(limit: 30) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        status\n        format\n        kind\n        from\n        to\n        createdAt\n        studentUser {\n          id\n          firstName\n          lastName\n        }\n        user {\n          id\n          firstName\n          lastName\n        }\n        file {\n          id\n        }\n      }\n    }\n  }\n": types.ReportsDocument,
    "\n    mutation createReport($input: CreateReportInput!) {\n      createReport(input: $input) {\n        id\n      }\n    }\n  ": types.CreateReportDocument,
    "\n    query userById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        student {\n          id\n          grade\n          joinedAt\n          leftAt\n          entriesCount\n          competencesCount\n          eventsCount\n        }\n      }\n    }\n  ": types.UserByIdDocument,
    "\n    query studentCompetence($competenceId: ID!, $user: ID!) {\n      competence(id: $competenceId) {\n        id\n        name\n        parents {\n          id\n          name\n        }\n        competences(sort: { field: sort_order, order: asc }) {\n          type\n          id\n          name\n          grades\n          parents {\n            id\n            name\n          }\n          userCompetences(userId: $user) {\n            id\n            level\n            entry {\n              id\n            }\n            createdBy {\n              firstName\n              lastName\n            }\n            createdAt\n          }\n        }\n      }\n    }\n  ": types.StudentCompetenceDocument,
    "\n    mutation createUserCompetence($input: CreateUserCompetenceInput!) {\n      createUserCompetence(input: $input) {\n        id\n        level\n      }\n    }\n  ": types.CreateUserCompetenceDocument,
    "\n    query studentCompetences {\n      competences(filter: { type: subject }, limit: 100, sort: { field: sort_order, order: asc }) {\n        edges {\n          id\n          name\n          grades\n        }\n      }\n    }\n  ": types.StudentCompetencesDocument,
    "\n    query studentEntries($filter: EntryFilterInput, $limit: Int) {\n      entries(filter: $filter, limit: $limit) {\n        edges {\n          id\n          date\n          body\n          user {\n            id\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  ": types.StudentEntriesDocument,
    "\n  query recordStudents($search: String, $order: UserOrderBy, $offset: Int) {\n    users(filter: { role: [student], orderBy: $order }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n        }\n      }\n    }\n  }\n": types.RecordStudentsDocument,
    "\n    mutation CreateTag($input: CreateTagInput!) {\n      createTag(input: $input) {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  ": types.CreateTagDocument,
    "\n    mutation UpdateTag($id: ID!, $input: CreateTagInput!) {\n      updateTag(id: $id, input: $input) {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  ": types.UpdateTagDocument,
    "\n    mutation ArchiveTag($id: ID!) {\n      archiveTag(id: $id) {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  ": types.ArchiveTagDocument,
    "\n  query getTagWithLimit($limit: Int, $offset: Int) {\n    tags(limit: $limit, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  }\n": types.GetTagWithLimitDocument,
    "\n    mutation resetPassword($input: ResetPasswordInput!) {\n      resetPassword(input: $input) {\n        success\n      }\n    }\n  ": types.ResetPasswordDocument,
    "\n  mutation archiveEntry($id: ID!) {\n    archiveEntry(id: $id) {\n      id\n    }\n  }\n": types.ArchiveEntryDocument,
    "\n    mutation signIn($email: String!, $password: String!) {\n        signIn(input: {email: $email, password: $password }) {\n            token\n            enabled_apps\n            language\n        }\n    }\n": types.SignInDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation signOut {\n      signOut\n    }\n  "): (typeof documents)["\n    mutation signOut {\n      signOut\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateUserLanguage($language: UserLanguage!) {\n      updateUserLanguage(language: $language) {\n        id\n        language\n      }\n    }\n  "): (typeof documents)["\n    mutation updateUserLanguage($language: UserLanguage!) {\n      updateUserLanguage(language: $language) {\n        id\n        language\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query competenceSearch($search: String, $filter: CompetenceFilterInput) {\n      competences(search: $search, filter: $filter, sort: { field: sort_order, order: asc }) {\n        edges {\n          id\n          name\n          type\n          color\n          grades\n          parents {\n            id\n            name\n            type\n            grades\n            color\n          }\n        }\n      }\n    }\n  "): (typeof documents)["\n    query competenceSearch($search: String, $filter: CompetenceFilterInput) {\n      competences(search: $search, filter: $filter, sort: { field: sort_order, order: asc }) {\n        edges {\n          id\n          name\n          type\n          color\n          grades\n          parents {\n            id\n            name\n            type\n            grades\n            color\n          }\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query competencePath($id: ID!) {\n      competence(id: $id) {\n        id\n        name\n        type\n        color\n        grades\n        parents {\n          id\n          name\n          type\n          grades\n          color\n        }\n      }\n    }\n  "): (typeof documents)["\n    query competencePath($id: ID!) {\n      competence(id: $id) {\n        id\n        name\n        type\n        color\n        grades\n        parents {\n          id\n          name\n          type\n          grades\n          color\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation previewFile($id: ID!) {\n      previewFile(input: { id: $id }) {\n        url\n      }\n    }\n  "): (typeof documents)["\n    mutation previewFile($id: ID!) {\n      previewFile(input: { id: $id }) {\n        url\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query adminStudentById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        role\n        student {\n          id\n          grade\n          birthday\n          joinedAt\n          leftAt\n        }\n      }\n    }\n  "): (typeof documents)["\n    query adminStudentById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        role\n        student {\n          id\n          grade\n          birthday\n          joinedAt\n          leftAt\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateStudent($student: UpdateUserInput!) {\n      updateUser(input: $student) {\n        id\n        firstName\n        lastName\n        role\n        student {\n          id\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  "): (typeof documents)["\n    mutation updateStudent($student: UpdateUserInput!) {\n      updateUser(input: $student) {\n        id\n        firstName\n        lastName\n        role\n        student {\n          id\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation archiveStudent($id: ID!) {\n      archiveUser(id: $id) {\n        id\n        firstName\n        lastName\n        role\n        student {\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  "): (typeof documents)["\n    mutation archiveStudent($id: ID!) {\n      archiveUser(id: $id) {\n        id\n        firstName\n        lastName\n        role\n        student {\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query adminStudents($search: String, $order: UserOrderBy, $offset: Int) {\n    users(filter: { role: [student], orderBy: $order }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query adminStudents($search: String, $order: UserOrderBy, $offset: Int) {\n    users(filter: { role: [student], orderBy: $order }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createStudent($student: CreateStudentInput!) {\n      createStudent(input: $student) {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  "): (typeof documents)["\n    mutation createStudent($student: CreateStudentInput!) {\n      createStudent(input: $student) {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query adminUserById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        email\n        role\n      }\n    }\n  "): (typeof documents)["\n    query adminUserById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        email\n        role\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateUser($input: UpdateUserInput!) {\n      updateUser(input: $input) {\n        id\n        firstName\n        lastName\n        email\n        role\n      }\n    }\n  "): (typeof documents)["\n    mutation updateUser($input: UpdateUserInput!) {\n      updateUser(input: $input) {\n        id\n        firstName\n        lastName\n        email\n        role\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation archiveUser($id: ID!) {\n      archiveUser(id: $id) {\n        id\n        firstName\n        lastName\n        email\n        role\n      }\n    }\n  "): (typeof documents)["\n    mutation archiveUser($id: ID!) {\n      archiveUser(id: $id) {\n        id\n        firstName\n        lastName\n        email\n        role\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query adminUsers($search: String, $order: UserOrderBy, $offset: Int) {\n    users(filter: { role: [owner, admin, teacher], orderBy: $order }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  query adminUsers($search: String, $order: UserOrderBy, $offset: Int) {\n    users(filter: { role: [owner, admin, teacher], orderBy: $order }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createUser($user: CreateUserInput!) {\n      createUser(input: $user) {\n        id\n        firstName\n        lastName\n      }\n    }\n  "): (typeof documents)["\n    mutation createUser($user: CreateUserInput!) {\n      createUser(input: $user) {\n        id\n        firstName\n        lastName\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation deleteFile($id: ID!) {\n      deleteFile(input: { id: $id }) {\n        success\n        file {\n          id\n        }\n      }\n    }\n  "): (typeof documents)["\n    mutation deleteFile($id: ID!) {\n      deleteFile(input: { id: $id }) {\n        success\n        file {\n          id\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query files($offset: Int, $limit: Int, $filter: FilesFilterInput) {\n    files(input: $filter, limit: $limit, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        fileType\n        MIMEType\n        size\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query files($offset: Int, $limit: Int, $filter: FilesFilterInput) {\n    files(input: $filter, limit: $limit, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        fileType\n        MIMEType\n        size\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createFolder($input: CreateFolderInput!) {\n      createFolder(input: $input) {\n        id\n      }\n    }\n  "): (typeof documents)["\n    mutation createFolder($input: CreateFolderInput!) {\n      createFolder(input: $input) {\n        id\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query fileById($id: ID!) {\n      file(id: $id) {\n        id\n        name\n        parents {\n          id\n          name\n        }\n      }\n    }\n  "): (typeof documents)["\n    query fileById($id: ID!) {\n      file(id: $id) {\n        id\n        name\n        parents {\n          id\n          name\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation renameFile($input: RenameFileInput!) {\n      renameFile(input: $input) {\n        id\n        name\n      }\n    }\n  "): (typeof documents)["\n    mutation renameFile($input: RenameFileInput!) {\n      renameFile(input: $input) {\n        id\n        name\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation uploadFile($input: FileUploadInput!) {\n      uploadFile(input: $input) {\n        id\n      }\n    }\n  "): (typeof documents)["\n    mutation uploadFile($input: FileUploadInput!) {\n      uploadFile(input: $input) {\n        id\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation forgotPassword($input: ForgotPasswordInput!) {\n      forgotPassword(input: $input) {\n        success\n      }\n    }\n  "): (typeof documents)["\n    mutation forgotPassword($input: ForgotPasswordInput!) {\n      forgotPassword(input: $input) {\n        success\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateCompetence($input: UpdateCompetenceInput!) {\n      updateCompetence(input: $input) {\n        id\n        name\n        color\n      }\n    }\n  "): (typeof documents)["\n    mutation updateCompetence($input: UpdateCompetenceInput!) {\n      updateCompetence(input: $input) {\n        id\n        name\n        color\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query competence($search: String, $limit: Int, $offset: Int, $parent: [ID]) {\n    competences(\n      filter: { parents: $parent }\n      search: $search\n      limit: $limit\n      offset: $offset\n      sort: { field: sort_order, order: asc }\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        type\n        grades\n        color\n        sortOrder\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query competence($search: String, $limit: Int, $offset: Int, $parent: [ID]) {\n    competences(\n      filter: { parents: $parent }\n      search: $search\n      limit: $limit\n      offset: $offset\n      sort: { field: sort_order, order: asc }\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        type\n        grades\n        color\n        sortOrder\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query competenceSubjects($search: String, $limit: Int, $offset: Int) {\n    competences(\n      filter: { type: subject }\n      search: $search\n      limit: $limit\n      offset: $offset\n      sort: { field: sort_order, order: asc }\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        type\n        grades\n        color\n        sortOrder\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query competenceSubjects($search: String, $limit: Int, $offset: Int) {\n    competences(\n      filter: { type: subject }\n      search: $search\n      limit: $limit\n      offset: $offset\n      sort: { field: sort_order, order: asc }\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        type\n        grades\n        color\n        sortOrder\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createEntry($input: CreateEntryInput!) {\n    createEntry(input: $input) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createEntry($input: CreateEntryInput!) {\n    createEntry(input: $input) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateEntry($input: UpdateEntryInput!) {\n    updateEntry(input: $input) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateEntry($input: UpdateEntryInput!) {\n    updateEntry(input: $input) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query events {\n      events {\n        edges {\n          id\n          title\n        }\n      }\n    }\n  "): (typeof documents)["\n    query events {\n      events {\n        edges {\n          id\n          title\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query users($search: String) {\n      users(filter: { role: [student] }, search: $search, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "): (typeof documents)["\n    query users($search: String) {\n      users(filter: { role: [student] }, search: $search, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query entryById($id: ID!) {\n      entry(id: $id) {\n        id\n        date\n        body\n        deletedAt\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        tags {\n          id\n          name\n          color\n        }\n        events {\n          id\n          title\n        }\n        users {\n          id\n          firstName\n          lastName\n        }\n        userCompetences {\n          id\n          level\n          competence {\n            id\n            name\n            color\n            type\n            grades\n            parents {\n              id\n              name\n              grades\n              color\n            }\n          }\n        }\n      }\n    }\n  "): (typeof documents)["\n    query entryById($id: ID!) {\n      entry(id: $id) {\n        id\n        date\n        body\n        deletedAt\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        tags {\n          id\n          name\n          color\n        }\n        events {\n          id\n          title\n        }\n        users {\n          id\n          firstName\n          lastName\n        }\n        userCompetences {\n          id\n          level\n          competence {\n            id\n            name\n            color\n            type\n            grades\n            parents {\n              id\n              name\n              grades\n              color\n            }\n          }\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getEntries($filter: EntryFilterInput, $limit: Int, $order: EntrySortBy, $offset: Int) {\n    entries(filter: $filter, limit: $limit, sortBy: $order, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        date\n        body\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        events {\n          id\n          title\n        }\n        tags {\n          id\n          name\n          color\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getEntries($filter: EntryFilterInput, $limit: Int, $order: EntrySortBy, $offset: Int) {\n    entries(filter: $filter, limit: $limit, sortBy: $order, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        date\n        body\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        events {\n          id\n          title\n        }\n        tags {\n          id\n          name\n          color\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getEntryFilterStudents {\n      users(filter: { role: [student] }, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "): (typeof documents)["\n    query getEntryFilterStudents {\n      users(filter: { role: [student] }, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getEntryFilterTeachers {\n      users(filter: { role: [owner, admin, teacher, educator] }, limit: 500) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "): (typeof documents)["\n    query getEntryFilterTeachers {\n      users(filter: { role: [owner, admin, teacher, educator] }, limit: 500) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getEntryFilterTags {\n      tags(limit: 1000) {\n        edges {\n          id\n          name\n          color\n        }\n      }\n    }\n  "): (typeof documents)["\n    query getEntryFilterTags {\n      tags(limit: 1000) {\n        edges {\n          id\n          name\n          color\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation toggleEventCompetence($input: AddEventCompetenceInput!) {\n      toggleEventCompetence(input: $input) {\n        id\n      }\n    }\n  "): (typeof documents)["\n    mutation toggleEventCompetence($input: AddEventCompetenceInput!) {\n      toggleEventCompetence(input: $input) {\n        id\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation archiveEvent($id: ID!) {\n      archiveEvent(id: $id) {\n        id\n      }\n    }\n  "): (typeof documents)["\n    mutation archiveEvent($id: ID!) {\n      archiveEvent(id: $id) {\n        id\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createEvent($input: CreateEventInput!) {\n      createEvent(input: $input) {\n        id\n        title\n        image {\n          id\n        }\n        body\n        startsAt\n        endsAt\n        recurrence\n        createdAt\n      }\n    }\n  "): (typeof documents)["\n    mutation createEvent($input: CreateEventInput!) {\n      createEvent(input: $input) {\n        id\n        title\n        image {\n          id\n        }\n        body\n        startsAt\n        endsAt\n        recurrence\n        createdAt\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateEvent($input: UpdateEventInput!) {\n      updateEvent(input: $input) {\n        id\n        title\n        image {\n          id\n        }\n        body\n        startsAt\n        endsAt\n        recurrence\n        createdAt\n      }\n    }\n  "): (typeof documents)["\n    mutation updateEvent($input: UpdateEventInput!) {\n      updateEvent(input: $input) {\n        id\n        title\n        image {\n          id\n        }\n        body\n        startsAt\n        endsAt\n        recurrence\n        createdAt\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query event($id: ID!) {\n      event(id: $id) {\n        id\n        title\n        body\n        createdAt\n        startsAt\n        endsAt\n        competences {\n          id\n          name\n          type\n          grades\n          parents {\n            id\n            name\n            type\n            grades\n          }\n        }\n      }\n    }\n  "): (typeof documents)["\n    query event($id: ID!) {\n      event(id: $id) {\n        id\n        title\n        body\n        createdAt\n        startsAt\n        endsAt\n        competences {\n          id\n          name\n          type\n          grades\n          parents {\n            id\n            name\n            type\n            grades\n          }\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query exportEvents($input: ExportEventsInput!) {\n      exportEvents(input: $input) {\n        id\n        title\n        body\n        startsAt\n        endsAt\n        subjects\n      }\n    }\n  "): (typeof documents)["\n    query exportEvents($input: ExportEventsInput!) {\n      exportEvents(input: $input) {\n        id\n        title\n        body\n        startsAt\n        endsAt\n        subjects\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query eventWithSearch($search: String, $offset: Int, $filter: EventFilterInput) {\n    events(search: $search, limit: 50, offset: $offset, filter: $filter) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        title\n        body\n        createdAt\n        startsAt\n        endsAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query eventWithSearch($search: String, $offset: Int, $filter: EventFilterInput) {\n    events(search: $search, limit: 50, offset: $offset, filter: $filter) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        title\n        body\n        createdAt\n        startsAt\n        endsAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query students {\n      users(filter: { role: [student] }, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n          student {\n            id\n          }\n        }\n      }\n    }\n  "): (typeof documents)["\n    query students {\n      users(filter: { role: [student] }, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n          student {\n            id\n          }\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetTags {\n      tags(limit: 1000) {\n        edges {\n          id\n          name\n          color\n          deletedAt\n          createdAt\n        }\n      }\n    }\n  "): (typeof documents)["\n    query GetTags {\n      tags(limit: 1000) {\n        edges {\n          id\n          name\n          color\n          deletedAt\n          createdAt\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query reports {\n    reports(limit: 30) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        status\n        format\n        kind\n        from\n        to\n        createdAt\n        studentUser {\n          id\n          firstName\n          lastName\n        }\n        user {\n          id\n          firstName\n          lastName\n        }\n        file {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query reports {\n    reports(limit: 30) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        status\n        format\n        kind\n        from\n        to\n        createdAt\n        studentUser {\n          id\n          firstName\n          lastName\n        }\n        user {\n          id\n          firstName\n          lastName\n        }\n        file {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createReport($input: CreateReportInput!) {\n      createReport(input: $input) {\n        id\n      }\n    }\n  "): (typeof documents)["\n    mutation createReport($input: CreateReportInput!) {\n      createReport(input: $input) {\n        id\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query userById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        student {\n          id\n          grade\n          joinedAt\n          leftAt\n          entriesCount\n          competencesCount\n          eventsCount\n        }\n      }\n    }\n  "): (typeof documents)["\n    query userById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        student {\n          id\n          grade\n          joinedAt\n          leftAt\n          entriesCount\n          competencesCount\n          eventsCount\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query studentCompetence($competenceId: ID!, $user: ID!) {\n      competence(id: $competenceId) {\n        id\n        name\n        parents {\n          id\n          name\n        }\n        competences(sort: { field: sort_order, order: asc }) {\n          type\n          id\n          name\n          grades\n          parents {\n            id\n            name\n          }\n          userCompetences(userId: $user) {\n            id\n            level\n            entry {\n              id\n            }\n            createdBy {\n              firstName\n              lastName\n            }\n            createdAt\n          }\n        }\n      }\n    }\n  "): (typeof documents)["\n    query studentCompetence($competenceId: ID!, $user: ID!) {\n      competence(id: $competenceId) {\n        id\n        name\n        parents {\n          id\n          name\n        }\n        competences(sort: { field: sort_order, order: asc }) {\n          type\n          id\n          name\n          grades\n          parents {\n            id\n            name\n          }\n          userCompetences(userId: $user) {\n            id\n            level\n            entry {\n              id\n            }\n            createdBy {\n              firstName\n              lastName\n            }\n            createdAt\n          }\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createUserCompetence($input: CreateUserCompetenceInput!) {\n      createUserCompetence(input: $input) {\n        id\n        level\n      }\n    }\n  "): (typeof documents)["\n    mutation createUserCompetence($input: CreateUserCompetenceInput!) {\n      createUserCompetence(input: $input) {\n        id\n        level\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query studentCompetences {\n      competences(filter: { type: subject }, limit: 100, sort: { field: sort_order, order: asc }) {\n        edges {\n          id\n          name\n          grades\n        }\n      }\n    }\n  "): (typeof documents)["\n    query studentCompetences {\n      competences(filter: { type: subject }, limit: 100, sort: { field: sort_order, order: asc }) {\n        edges {\n          id\n          name\n          grades\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query studentEntries($filter: EntryFilterInput, $limit: Int) {\n      entries(filter: $filter, limit: $limit) {\n        edges {\n          id\n          date\n          body\n          user {\n            id\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  "): (typeof documents)["\n    query studentEntries($filter: EntryFilterInput, $limit: Int) {\n      entries(filter: $filter, limit: $limit) {\n        edges {\n          id\n          date\n          body\n          user {\n            id\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query recordStudents($search: String, $order: UserOrderBy, $offset: Int) {\n    users(filter: { role: [student], orderBy: $order }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query recordStudents($search: String, $order: UserOrderBy, $offset: Int) {\n    users(filter: { role: [student], orderBy: $order }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateTag($input: CreateTagInput!) {\n      createTag(input: $input) {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  "): (typeof documents)["\n    mutation CreateTag($input: CreateTagInput!) {\n      createTag(input: $input) {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateTag($id: ID!, $input: CreateTagInput!) {\n      updateTag(id: $id, input: $input) {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  "): (typeof documents)["\n    mutation UpdateTag($id: ID!, $input: CreateTagInput!) {\n      updateTag(id: $id, input: $input) {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ArchiveTag($id: ID!) {\n      archiveTag(id: $id) {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  "): (typeof documents)["\n    mutation ArchiveTag($id: ID!) {\n      archiveTag(id: $id) {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getTagWithLimit($limit: Int, $offset: Int) {\n    tags(limit: $limit, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query getTagWithLimit($limit: Int, $offset: Int) {\n    tags(limit: $limit, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation resetPassword($input: ResetPasswordInput!) {\n      resetPassword(input: $input) {\n        success\n      }\n    }\n  "): (typeof documents)["\n    mutation resetPassword($input: ResetPasswordInput!) {\n      resetPassword(input: $input) {\n        success\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation archiveEntry($id: ID!) {\n    archiveEntry(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation archiveEntry($id: ID!) {\n    archiveEntry(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation signIn($email: String!, $password: String!) {\n        signIn(input: {email: $email, password: $password }) {\n            token\n            enabled_apps\n            language\n        }\n    }\n"): (typeof documents)["\n    mutation signIn($email: String!, $password: String!) {\n        signIn(input: {email: $email, password: $password }) {\n            token\n            enabled_apps\n            language\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
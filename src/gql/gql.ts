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
    "\n    mutation renameSharedDrive($input: RenameSharedDriveInput!) {\n      renameSharedDrive(input: $input) {\n        id\n        name\n      }\n    }\n  ": types.RenameSharedDriveDocument,
    "\n    mutation renameFile($input: RenameFileInput!) {\n      renameFile(input: $input) {\n        id\n        name\n      }\n    }\n  ": types.RenameFileDocument,
    "\n    query shareUsers {\n      users(filter: { role: [owner, admin, teacher] }) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  ": types.ShareUsersDocument,
    "\n  query BucketShares($input: ShareInput!) {\n    shares(input: $input) {\n      user {\n        id\n        firstName\n        lastName\n      }\n      permission\n    }\n  }\n": types.BucketSharesDocument,
    "\n    query meBucketShare {\n      me {\n        id\n      }\n    }\n  ": types.MeBucketShareDocument,
    "\n    mutation createShare($input: CreateShareInput!) {\n      createShare(input: $input) {\n        permission\n        user {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  ": types.CreateShareDocument,
    "\n    mutation deleteShare($input: DeleteShareInput!) {\n      deleteShare(input: $input) {\n        user {\n          id\n        }\n      }\n    }\n  ": types.DeleteShareDocument,
    "\n    mutation editShare($input: CreateShareInput!) {\n      editShare(input: $input) {\n        permission\n        user {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  ": types.EditShareDocument,
    "\n    mutation moveFile($input: MoveFileInput!) {\n      moveFile(input: $input) {\n        id\n        parent {\n          id\n        }\n      }\n    }\n  ": types.MoveFileDocument,
    "\n    query fileById($id: ID!) {\n      file(id: $id) {\n        id\n        name\n        parents {\n          id\n          name\n        }\n      }\n    }\n  ": types.FileByIdDocument,
    "\n    query bucketById($id: ID!) {\n      bucket(id: $id) {\n        id\n        name\n      }\n    }\n  ": types.BucketByIdDocument,
    "\n    mutation deleteFile($id: ID!) {\n      deleteFile(input: { id: $id }) {\n        success\n        file {\n          id\n        }\n      }\n    }\n  ": types.DeleteFileDocument,
    "\n  query files($offset: Int, $limit: Int, $filter: FilesFilterInput) {\n    files(input: $filter, limit: $limit, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        fileType\n        MIMEType\n        size\n        createdAt\n      }\n    }\n  }\n": types.FilesDocument,
    "\n    mutation createFolder($input: CreateFolderInput!) {\n      createFolder(input: $input) {\n        id\n      }\n    }\n  ": types.CreateFolderDocument,
    "\n    query competenceSearch($search: String, $filter: CompetenceFilterInput) {\n      competences(search: $search, filter: $filter, sort: { field: sort_order, order: asc }) {\n        edges {\n          id\n          name\n          type\n          color\n          grades\n          parents {\n            id\n            name\n            type\n            grades\n            color\n          }\n        }\n      }\n    }\n  ": types.CompetenceSearchDocument,
    "\n    query competencePath($id: ID!) {\n      competence(id: $id) {\n        id\n        name\n        type\n        color\n        grades\n        parents {\n          id\n          name\n          type\n          grades\n          color\n        }\n      }\n    }\n  ": types.CompetencePathDocument,
    "\n    mutation updateCompetence($input: UpdateCompetenceInput!) {\n      updateCompetence(input: $input) {\n        id\n        name\n        color\n      }\n    }\n  ": types.UpdateCompetenceDocument,
    "\n    mutation uploadFile($input: FileUploadInput!) {\n      uploadFile(input: $input) {\n        id\n      }\n    }\n  ": types.UploadFileDocument,
    "\n    query bucketByIdShared($id: ID!) {\n      bucket(id: $id) {\n        id\n        permission\n      }\n    }\n  ": types.BucketByIdSharedDocument,
    "\n    query users($search: String) {\n      users(filter: { role: [student], orderBy: lastNameAsc }, search: $search, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  ": types.UsersDocument,
    "\n    query domains {\n      domains {\n        edges {\n          id\n          name\n          createdAt\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n        }\n      }\n    }\n  ": types.DomainsDocument,
    "\n    query groupUsers {\n      emailAccounts(filter: { type: INDIVIDUAL }) {\n        edges {\n          id\n          name\n        }\n      }\n    }\n  ": types.GroupUsersDocument,
    "\n    mutation toggleEventCompetence($input: AddEventCompetenceInput!) {\n      toggleEventCompetence(input: $input) {\n        id\n      }\n    }\n  ": types.ToggleEventCompetenceDocument,
    "\n    mutation archiveEvent($id: ID!) {\n      archiveEvent(id: $id) {\n        id\n      }\n    }\n  ": types.ArchiveEventDocument,
    "\n    mutation createEvent($input: CreateEventInput!) {\n      createEvent(input: $input) {\n        id\n        title\n        image {\n          id\n        }\n        body\n        startsAt\n        endsAt\n        recurrence\n        createdAt\n      }\n    }\n  ": types.CreateEventDocument,
    "\n    mutation updateEvent($input: UpdateEventInput!) {\n      updateEvent(input: $input) {\n        id\n        title\n        image {\n          id\n        }\n        body\n        startsAt\n        endsAt\n        recurrence\n        createdAt\n      }\n    }\n  ": types.UpdateEventDocument,
    "\n    query students {\n      users(filter: { role: [student] }, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n          student {\n            id\n          }\n        }\n      }\n    }\n  ": types.StudentsDocument,
    "\n    query GetTags {\n      tags(limit: 1000) {\n        edges {\n          id\n          name\n          color\n          deletedAt\n          createdAt\n        }\n      }\n    }\n  ": types.GetTagsDocument,
    "\n    mutation CreateTag($input: CreateTagInput!) {\n      createTag(input: $input) {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  ": types.CreateTagDocument,
    "\n    mutation UpdateTag($id: ID!, $input: CreateTagInput!) {\n      updateTag(id: $id, input: $input) {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  ": types.UpdateTagDocument,
    "\n    mutation ArchiveTag($id: ID!) {\n      archiveTag(id: $id) {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  ": types.ArchiveTagDocument,
    "\n    query mEvents($search: String) {\n      events(search: $search, limit: 100) {\n        edges {\n          id\n          title\n        }\n      }\n    }\n  ": types.MEventsDocument,
    "\n    query tags {\n      tags(limit: 50) {\n        edges {\n          id\n          name\n          color\n        }\n      }\n    }\n  ": types.TagsDocument,
    "\n    mutation updateUserLanguage($language: UserLanguage!) {\n      updateUserLanguage(language: $language) {\n        id\n        language\n      }\n    }\n  ": types.UpdateUserLanguageDocument,
    "\n      mutation signOut {\n        signOut\n      }\n    ": types.SignOutDocument,
    "\n    mutation previewFile($id: ID!) {\n      previewFile(input: { id: $id }) {\n        url\n      }\n    }\n  ": types.PreviewFileDocument,
    "\n  query domains {\n    domains {\n      edges {\n        id\n        name\n        createdAt\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.DomainsDocument,
    "\n    query adminDomainById($id: ID!) {\n      domain(id: $id) {\n        id\n        name\n        createdAt\n      }\n    }\n  ": types.AdminDomainByIdDocument,
    "\n    mutation deleteDomain($input: DeleteDomainInput!) {\n      deleteDomain(input: $input) {\n        name\n        createdAt\n      }\n    }\n  ": types.DeleteDomainDocument,
    "\n    mutation createDomain($input: CreateDomainInput!) {\n      createDomain(input: $input) {\n        id\n        name\n        createdAt\n      }\n    }\n  ": types.CreateDomainDocument,
    "\n    query organisation {\n      organisation {\n        id\n        name\n        legalName\n      }\n    }\n  ": types.OrganisationDocument,
    "\n    mutation updateOrganisation($input: UpdateOrganisationInput!) {\n      updateOrganisation(input: $input) {\n        id\n        name\n        legalName\n      }\n    }\n  ": types.UpdateOrganisationDocument,
    "\n  query groups {\n    emailAccounts(filter: { type: GROUP }) {\n      edges {\n        id\n        name\n        description\n      }\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.GroupsDocument,
    "\n    query adminGroupById($id: ID!) {\n      emailAccount(id: $id) {\n        id\n        name\n        description\n        members {\n          name\n        }\n      }\n    }\n  ": types.AdminGroupByIdDocument,
    "\n    mutation deleteEmailGroup($id: ID!) {\n      deleteEmailGroup(id: $id) {\n        id\n        name\n      }\n    }\n  ": types.DeleteEmailGroupDocument,
    "\n    mutation editEmailGroup($input: UpdateEmailGroupInput!) {\n      updateEmailGroup(input: $input) {\n        id\n        name\n        description\n      }\n    }\n  ": types.EditEmailGroupDocument,
    "\n    mutation createEmailGroup($input: CreateEmailGroupInput!) {\n      createEmailGroup(input: $input) {\n        id\n        name\n        description\n        members {\n          name\n        }\n      }\n    }\n  ": types.CreateEmailGroupDocument,
    "\n  query adminUsers($search: String, $order: UserOrderBy, $offset: Int, $showDeleted: Boolean) {\n    users(\n      filter: { role: [owner, admin, teacher], orderBy: $order, showDeleted: $showDeleted }\n      search: $search\n      offset: $offset\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n": types.AdminUsersDocument,
    "\n    query adminUserById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        email\n        role\n        inviteAccepted\n      }\n    }\n  ": types.AdminUserByIdDocument,
    "\n    mutation updateUser($input: UpdateUserInput!) {\n      updateUser(input: $input) {\n        id\n        firstName\n        lastName\n        email\n        role\n      }\n    }\n  ": types.UpdateUserDocument,
    "\n    mutation archiveUser($id: ID!) {\n      archiveUser(id: $id) {\n        id\n        firstName\n        lastName\n        email\n        role\n      }\n    }\n  ": types.ArchiveUserDocument,
    "\n    mutation forgotPassword($input: ForgotPasswordInput!) {\n      forgotPassword(input: $input) {\n        success\n      }\n    }\n  ": types.ForgotPasswordDocument,
    "\n    mutation sendInvite($id: ID!) {\n      sendUserInvite(id: $id)\n    }\n  ": types.SendInviteDocument,
    "\n    mutation createUser($user: CreateUserInput!) {\n      createUser(input: $user) {\n        id\n        firstName\n        lastName\n      }\n    }\n  ": types.CreateUserDocument,
    "\n    query file($id: ID!) {\n      file(id: $id) {\n        id\n        name\n        fileType\n        MIMEType\n        size\n        createdAt\n      }\n    }\n  ": types.FileDocument,
    "\n    mutation deleteSharedDrive($id: ID!) {\n      deleteSharedDrive(id: $id) {\n        id\n      }\n    }\n  ": types.DeleteSharedDriveDocument,
    "\n    mutation createSharedDrive($name: String!) {\n      createSharedDrive(name: $name) {\n        id\n        name\n      }\n    }\n  ": types.CreateSharedDriveDocument,
    "\n  query buckets {\n    buckets(input: { shared: true }) {\n      edges {\n        id\n        name\n        shared\n        createdAt\n        permission\n      }\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.BucketsDocument,
    "\n    mutation resetPassword($input: ResetPasswordInput!) {\n      resetPassword(input: $input) {\n        success\n      }\n    }\n  ": types.ResetPasswordDocument,
    "\n  query mGetEntries($limit: Int, $order: EntrySortBy, $offset: Int) {\n    entries(limit: $limit, sortBy: $order, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        date\n        body\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n      }\n    }\n  }\n": types.MGetEntriesDocument,
    "\n  query competence($search: String, $limit: Int, $offset: Int, $filter: CompetenceFilterInput) {\n    competences(\n      filter: $filter\n      search: $search\n      limit: $limit\n      offset: $offset\n      sort: { field: sort_order, order: asc }\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        type\n        grades\n        color\n        sortOrder\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  }\n": types.CompetenceDocument,
    "\n    query zeCompetenceParents($id: ID!) {\n      competence(id: $id) {\n        id\n        name\n        type\n        grades\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  ": types.ZeCompetenceParentsDocument,
    "\n  query competenceSubjects($search: String, $limit: Int, $offset: Int) {\n    competences(\n      filter: { type: subject }\n      search: $search\n      limit: $limit\n      offset: $offset\n      sort: { field: sort_order, order: asc }\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        type\n        grades\n        color\n        sortOrder\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  }\n": types.CompetenceSubjectsDocument,
    "\n    query entryById($id: ID!) {\n      entry(id: $id) {\n        id\n        date\n        body\n        deletedAt\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        tags {\n          id\n          name\n          color\n        }\n        events {\n          id\n          title\n        }\n        users {\n          id\n          firstName\n          lastName\n        }\n        userCompetences {\n          id\n          level\n          competence {\n            id\n            name\n            color\n            type\n            grades\n            parents {\n              id\n              name\n              grades\n              color\n            }\n          }\n        }\n      }\n    }\n  ": types.EntryByIdDocument,
    "\n  query getEntries($filter: EntryFilterInput, $limit: Int, $order: EntrySortBy, $offset: Int) {\n    entries(filter: $filter, limit: $limit, sortBy: $order, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        date\n        body\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        events {\n          id\n          title\n        }\n        tags {\n          id\n          name\n          color\n        }\n      }\n    }\n  }\n": types.GetEntriesDocument,
    "\n    query getEntryFilterTeachers($search: String) {\n      users(filter: { role: [owner, admin, teacher, educator] }, limit: 500, search: $search) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  ": types.GetEntryFilterTeachersDocument,
    "\n    query getEntryFilterStudents($search: String) {\n      users(filter: { role: [student] }, limit: 200, search: $search) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  ": types.GetEntryFilterStudentsDocument,
    "\n    query event($id: ID!) {\n      event(id: $id) {\n        id\n        title\n        body\n        createdAt\n        startsAt\n        endsAt\n        competences {\n          id\n          name\n          type\n          grades\n          parents {\n            id\n            name\n            type\n            grades\n            color\n          }\n        }\n      }\n    }\n  ": types.EventDocument,
    "\n    query exportEvents($input: ExportEventsInput!) {\n      exportEvents(input: $input) {\n        id\n        title\n        body\n        startsAt\n        endsAt\n        subjects\n      }\n    }\n  ": types.ExportEventsDocument,
    "\n  query eventWithSearch($search: String, $offset: Int, $order: EventOrderBy, $filter: EventFilterInput) {\n    events(search: $search, limit: 50, offset: $offset, order: $order, filter: $filter) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        title\n        body\n        createdAt\n        startsAt\n        endsAt\n      }\n    }\n  }\n": types.EventWithSearchDocument,
    "\n  query reports {\n    reports(limit: 30) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        status\n        format\n        kind\n        from\n        to\n        createdAt\n        studentUser {\n          id\n          firstName\n          lastName\n        }\n        user {\n          id\n          firstName\n          lastName\n        }\n        file {\n          id\n        }\n      }\n    }\n  }\n": types.ReportsDocument,
    "\n    mutation createReport($input: CreateReportInput!) {\n      createReport(input: $input) {\n        id\n      }\n    }\n  ": types.CreateReportDocument,
    "\n    query userById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        student {\n          id\n          grade\n          joinedAt\n          leftAt\n          entriesCount\n          competencesCount\n          eventsCount\n        }\n      }\n    }\n  ": types.UserByIdDocument,
    "\n    query studentCompetence($competenceId: ID!, $user: ID!) {\n      competence(id: $competenceId) {\n        id\n        name\n        parents {\n          id\n          name\n        }\n        competences(sort: { field: sort_order, order: asc }) {\n          type\n          id\n          name\n          grades\n          parents {\n            id\n            name\n          }\n          userCompetences(userId: $user) {\n            id\n            level\n            entry {\n              id\n            }\n            createdBy {\n              firstName\n              lastName\n            }\n            createdAt\n          }\n        }\n      }\n    }\n  ": types.StudentCompetenceDocument,
    "\n    mutation createUserCompetence($input: CreateUserCompetenceInput!) {\n      createUserCompetence(input: $input) {\n        id\n        level\n      }\n    }\n  ": types.CreateUserCompetenceDocument,
    "\n    query studentCompetences {\n      competences(filter: { type: subject }, limit: 100, sort: { field: sort_order, order: asc }) {\n        edges {\n          id\n          name\n          grades\n        }\n      }\n    }\n  ": types.StudentCompetencesDocument,
    "\n    query studentEntries($filter: EntryFilterInput, $limit: Int) {\n      entries(filter: $filter, limit: $limit) {\n        edges {\n          id\n          date\n          body\n          user {\n            id\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  ": types.StudentEntriesDocument,
    "\n  query recordStudents($search: String, $order: UserOrderBy, $offset: Int) {\n    users(filter: { role: [student], orderBy: $order }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n        }\n      }\n    }\n  }\n": types.RecordStudentsDocument,
    "\n  query getTagWithLimit($limit: Int, $offset: Int) {\n    tags(limit: $limit, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  }\n": types.GetTagWithLimitDocument,
    "\n  query adminStudents($search: String, $order: UserOrderBy, $offset: Int, $showDeleted: Boolean) {\n    users(filter: { role: [student], orderBy: $order, showDeleted: $showDeleted }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n        }\n      }\n    }\n  }\n": types.AdminStudentsDocument,
    "\n    query adminStudentById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        role\n        student {\n          id\n          grade\n          birthday\n          joinedAt\n          leftAt\n        }\n      }\n    }\n  ": types.AdminStudentByIdDocument,
    "\n    mutation updateStudent($student: UpdateUserInput!) {\n      updateUser(input: $student) {\n        id\n        firstName\n        lastName\n        role\n        student {\n          id\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  ": types.UpdateStudentDocument,
    "\n    mutation archiveStudent($id: ID!) {\n      archiveUser(id: $id) {\n        id\n        firstName\n        lastName\n        role\n        student {\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  ": types.ArchiveStudentDocument,
    "\n    mutation createStudent($student: CreateStudentInput!) {\n      createStudent(input: $student) {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  ": types.CreateStudentDocument,
    "\n  mutation archiveEntry($id: ID!) {\n    archiveEntry(id: $id) {\n      id\n    }\n  }\n": types.ArchiveEntryDocument,
    "\nmutation createEntry($input: CreateEntryInput!) {\n    createEntry(input: $input) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n        }\n      }\n    }\n  }\n": types.CreateEntryDocument,
    "\n  mutation createSchoolYear($year: Int!) {\n    createSchoolYear(input: { year: $year }) {\n      id\n      year\n      description\n    }\n  }\n": types.CreateSchoolYearDocument,
    "\n  mutation createSubject($name: String!) {\n    createSubject(input: { name: $name }) {\n      id\n      name\n    }\n  }\n": types.CreateSubjectDocument,
    "\n  query entryById($id: ID!) {\n    entry(id: $id) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n          grades\n          parents {\n            id\n            name\n            grades\n            color\n          }\n        }\n      }\n    }\n  }\n": types.EntryByIdDocument,
    "\n  query events($search: String) {\n    events(limit: 100, search: $search) {\n      edges {\n        id\n        title\n      }\n    }\n  }\n": types.EventsDocument,
    "\n    query me {\n        me {\n            id\n            role\n        }\n    }\n": types.MeDocument,
    "\n    mutation resetPassword($input: ResetPasswordInput!) {\n        resetPassword(input: $input) {\n        success\n        }\n    }\n": types.ResetPasswordDocument,
    "\n  query schoolYear($id: ID!) {\n    schoolYear(id: $id) {\n      id\n      year\n      description\n    }\n  }\n": types.SchoolYearDocument,
    "\n  query schoolYears($limit: Int, $offset: Int) {\n    schoolYears(limit: $limit, offset: $offset) {\n      edges {\n        id\n        year\n        description\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.SchoolYearsDocument,
    "\n    mutation signIn($email: String!, $password: String!) {\n        signIn(input: {email: $email, password: $password }) {\n            token\n            enabled_apps\n            language\n            setupComplete\n        }\n    }\n": types.SignInDocument,
    "\n    query subject($id: ID!) {\n      subject(id: $id) {\n        id\n        name\n      }\n    }\n": types.SubjectDocument,
    "\n  query subjects($limit: Int, $offset: Int) {\n    subjects(limit: $limit, offset: $offset) {\n      edges {\n        id\n        name\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.SubjectsDocument,
    "\n  query tagLimited($search: String) {\n    tags(limit: 100, search: $search) {\n      edges {\n        id\n        name\n        color\n      }\n    }\n  }\n": types.TagLimitedDocument,
    "\nmutation updateEntry($input: UpdateEntryInput!) {\n    updateEntry(input: $input) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n        }\n      }\n    }\n  }\n  ": types.UpdateEntryDocument,
    "\n  mutation updateSchoolYear($id: ID!, $year: Int!) {\n    updateSchoolYear(input: { id: $id, year: $year }) {\n      id\n      year\n      description\n    }\n  }\n": types.UpdateSchoolYearDocument,
    "\n    mutation updateSubject($id: ID!, $name: String!) {\n        updateSubject(input: { id: $id, name: $name }) {\n            id\n            name\n        }\n    }\n": types.UpdateSubjectDocument,
    "\n  mutation updateUserStudentGrade($id: ID!, $grade: Int!) {\n    updateUserStudentGrade(input: { id: $id, grade: $grade }) {\n      id\n      grade\n    }\n  }\n": types.UpdateUserStudentGradeDocument,
    "\n    query userStudentGrade($id: ID!) {\n      userStudentGrade(id: $id) {\n        id\n        grade\n        student {\n          id\n          user {\n            id\n            firstName\n            lastName\n          }\n        }\n        subject {\n          id\n          name\n        }\n        schoolYear {\n          id\n          year\n          description\n        }\n      }\n    }\n": types.UserStudentGradeDocument,
    "\n  query userStudentGrades($limit: Int, $offset: Int) {\n    userStudentGrades(limit: $limit, offset: $offset) {\n      edges {\n        id\n        grade\n        student {\n          id\n          user {\n            id\n            firstName\n            lastName\n          }\n        }\n        subject {\n          id\n          name\n        }\n        schoolYear {\n          id\n          year\n          description\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.UserStudentGradesDocument,
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
export function graphql(source: "\n    mutation renameSharedDrive($input: RenameSharedDriveInput!) {\n      renameSharedDrive(input: $input) {\n        id\n        name\n      }\n    }\n  "): (typeof documents)["\n    mutation renameSharedDrive($input: RenameSharedDriveInput!) {\n      renameSharedDrive(input: $input) {\n        id\n        name\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation renameFile($input: RenameFileInput!) {\n      renameFile(input: $input) {\n        id\n        name\n      }\n    }\n  "): (typeof documents)["\n    mutation renameFile($input: RenameFileInput!) {\n      renameFile(input: $input) {\n        id\n        name\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query shareUsers {\n      users(filter: { role: [owner, admin, teacher] }) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "): (typeof documents)["\n    query shareUsers {\n      users(filter: { role: [owner, admin, teacher] }) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BucketShares($input: ShareInput!) {\n    shares(input: $input) {\n      user {\n        id\n        firstName\n        lastName\n      }\n      permission\n    }\n  }\n"): (typeof documents)["\n  query BucketShares($input: ShareInput!) {\n    shares(input: $input) {\n      user {\n        id\n        firstName\n        lastName\n      }\n      permission\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query meBucketShare {\n      me {\n        id\n      }\n    }\n  "): (typeof documents)["\n    query meBucketShare {\n      me {\n        id\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createShare($input: CreateShareInput!) {\n      createShare(input: $input) {\n        permission\n        user {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "): (typeof documents)["\n    mutation createShare($input: CreateShareInput!) {\n      createShare(input: $input) {\n        permission\n        user {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation deleteShare($input: DeleteShareInput!) {\n      deleteShare(input: $input) {\n        user {\n          id\n        }\n      }\n    }\n  "): (typeof documents)["\n    mutation deleteShare($input: DeleteShareInput!) {\n      deleteShare(input: $input) {\n        user {\n          id\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation editShare($input: CreateShareInput!) {\n      editShare(input: $input) {\n        permission\n        user {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "): (typeof documents)["\n    mutation editShare($input: CreateShareInput!) {\n      editShare(input: $input) {\n        permission\n        user {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation moveFile($input: MoveFileInput!) {\n      moveFile(input: $input) {\n        id\n        parent {\n          id\n        }\n      }\n    }\n  "): (typeof documents)["\n    mutation moveFile($input: MoveFileInput!) {\n      moveFile(input: $input) {\n        id\n        parent {\n          id\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query fileById($id: ID!) {\n      file(id: $id) {\n        id\n        name\n        parents {\n          id\n          name\n        }\n      }\n    }\n  "): (typeof documents)["\n    query fileById($id: ID!) {\n      file(id: $id) {\n        id\n        name\n        parents {\n          id\n          name\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query bucketById($id: ID!) {\n      bucket(id: $id) {\n        id\n        name\n      }\n    }\n  "): (typeof documents)["\n    query bucketById($id: ID!) {\n      bucket(id: $id) {\n        id\n        name\n      }\n    }\n  "];
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
export function graphql(source: "\n    query competenceSearch($search: String, $filter: CompetenceFilterInput) {\n      competences(search: $search, filter: $filter, sort: { field: sort_order, order: asc }) {\n        edges {\n          id\n          name\n          type\n          color\n          grades\n          parents {\n            id\n            name\n            type\n            grades\n            color\n          }\n        }\n      }\n    }\n  "): (typeof documents)["\n    query competenceSearch($search: String, $filter: CompetenceFilterInput) {\n      competences(search: $search, filter: $filter, sort: { field: sort_order, order: asc }) {\n        edges {\n          id\n          name\n          type\n          color\n          grades\n          parents {\n            id\n            name\n            type\n            grades\n            color\n          }\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query competencePath($id: ID!) {\n      competence(id: $id) {\n        id\n        name\n        type\n        color\n        grades\n        parents {\n          id\n          name\n          type\n          grades\n          color\n        }\n      }\n    }\n  "): (typeof documents)["\n    query competencePath($id: ID!) {\n      competence(id: $id) {\n        id\n        name\n        type\n        color\n        grades\n        parents {\n          id\n          name\n          type\n          grades\n          color\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateCompetence($input: UpdateCompetenceInput!) {\n      updateCompetence(input: $input) {\n        id\n        name\n        color\n      }\n    }\n  "): (typeof documents)["\n    mutation updateCompetence($input: UpdateCompetenceInput!) {\n      updateCompetence(input: $input) {\n        id\n        name\n        color\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation uploadFile($input: FileUploadInput!) {\n      uploadFile(input: $input) {\n        id\n      }\n    }\n  "): (typeof documents)["\n    mutation uploadFile($input: FileUploadInput!) {\n      uploadFile(input: $input) {\n        id\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query bucketByIdShared($id: ID!) {\n      bucket(id: $id) {\n        id\n        permission\n      }\n    }\n  "): (typeof documents)["\n    query bucketByIdShared($id: ID!) {\n      bucket(id: $id) {\n        id\n        permission\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query users($search: String) {\n      users(filter: { role: [student], orderBy: lastNameAsc }, search: $search, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "): (typeof documents)["\n    query users($search: String) {\n      users(filter: { role: [student], orderBy: lastNameAsc }, search: $search, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query domains {\n      domains {\n        edges {\n          id\n          name\n          createdAt\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n        }\n      }\n    }\n  "): (typeof documents)["\n    query domains {\n      domains {\n        edges {\n          id\n          name\n          createdAt\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query groupUsers {\n      emailAccounts(filter: { type: INDIVIDUAL }) {\n        edges {\n          id\n          name\n        }\n      }\n    }\n  "): (typeof documents)["\n    query groupUsers {\n      emailAccounts(filter: { type: INDIVIDUAL }) {\n        edges {\n          id\n          name\n        }\n      }\n    }\n  "];
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
export function graphql(source: "\n    query students {\n      users(filter: { role: [student] }, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n          student {\n            id\n          }\n        }\n      }\n    }\n  "): (typeof documents)["\n    query students {\n      users(filter: { role: [student] }, limit: 1000) {\n        edges {\n          id\n          firstName\n          lastName\n          student {\n            id\n          }\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetTags {\n      tags(limit: 1000) {\n        edges {\n          id\n          name\n          color\n          deletedAt\n          createdAt\n        }\n      }\n    }\n  "): (typeof documents)["\n    query GetTags {\n      tags(limit: 1000) {\n        edges {\n          id\n          name\n          color\n          deletedAt\n          createdAt\n        }\n      }\n    }\n  "];
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
export function graphql(source: "\n    query mEvents($search: String) {\n      events(search: $search, limit: 100) {\n        edges {\n          id\n          title\n        }\n      }\n    }\n  "): (typeof documents)["\n    query mEvents($search: String) {\n      events(search: $search, limit: 100) {\n        edges {\n          id\n          title\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query tags {\n      tags(limit: 50) {\n        edges {\n          id\n          name\n          color\n        }\n      }\n    }\n  "): (typeof documents)["\n    query tags {\n      tags(limit: 50) {\n        edges {\n          id\n          name\n          color\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateUserLanguage($language: UserLanguage!) {\n      updateUserLanguage(language: $language) {\n        id\n        language\n      }\n    }\n  "): (typeof documents)["\n    mutation updateUserLanguage($language: UserLanguage!) {\n      updateUserLanguage(language: $language) {\n        id\n        language\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation signOut {\n        signOut\n      }\n    "): (typeof documents)["\n      mutation signOut {\n        signOut\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation previewFile($id: ID!) {\n      previewFile(input: { id: $id }) {\n        url\n      }\n    }\n  "): (typeof documents)["\n    mutation previewFile($id: ID!) {\n      previewFile(input: { id: $id }) {\n        url\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query domains {\n    domains {\n      edges {\n        id\n        name\n        createdAt\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query domains {\n    domains {\n      edges {\n        id\n        name\n        createdAt\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query adminDomainById($id: ID!) {\n      domain(id: $id) {\n        id\n        name\n        createdAt\n      }\n    }\n  "): (typeof documents)["\n    query adminDomainById($id: ID!) {\n      domain(id: $id) {\n        id\n        name\n        createdAt\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation deleteDomain($input: DeleteDomainInput!) {\n      deleteDomain(input: $input) {\n        name\n        createdAt\n      }\n    }\n  "): (typeof documents)["\n    mutation deleteDomain($input: DeleteDomainInput!) {\n      deleteDomain(input: $input) {\n        name\n        createdAt\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createDomain($input: CreateDomainInput!) {\n      createDomain(input: $input) {\n        id\n        name\n        createdAt\n      }\n    }\n  "): (typeof documents)["\n    mutation createDomain($input: CreateDomainInput!) {\n      createDomain(input: $input) {\n        id\n        name\n        createdAt\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query organisation {\n      organisation {\n        id\n        name\n        legalName\n      }\n    }\n  "): (typeof documents)["\n    query organisation {\n      organisation {\n        id\n        name\n        legalName\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateOrganisation($input: UpdateOrganisationInput!) {\n      updateOrganisation(input: $input) {\n        id\n        name\n        legalName\n      }\n    }\n  "): (typeof documents)["\n    mutation updateOrganisation($input: UpdateOrganisationInput!) {\n      updateOrganisation(input: $input) {\n        id\n        name\n        legalName\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query groups {\n    emailAccounts(filter: { type: GROUP }) {\n      edges {\n        id\n        name\n        description\n      }\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query groups {\n    emailAccounts(filter: { type: GROUP }) {\n      edges {\n        id\n        name\n        description\n      }\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query adminGroupById($id: ID!) {\n      emailAccount(id: $id) {\n        id\n        name\n        description\n        members {\n          name\n        }\n      }\n    }\n  "): (typeof documents)["\n    query adminGroupById($id: ID!) {\n      emailAccount(id: $id) {\n        id\n        name\n        description\n        members {\n          name\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation deleteEmailGroup($id: ID!) {\n      deleteEmailGroup(id: $id) {\n        id\n        name\n      }\n    }\n  "): (typeof documents)["\n    mutation deleteEmailGroup($id: ID!) {\n      deleteEmailGroup(id: $id) {\n        id\n        name\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation editEmailGroup($input: UpdateEmailGroupInput!) {\n      updateEmailGroup(input: $input) {\n        id\n        name\n        description\n      }\n    }\n  "): (typeof documents)["\n    mutation editEmailGroup($input: UpdateEmailGroupInput!) {\n      updateEmailGroup(input: $input) {\n        id\n        name\n        description\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createEmailGroup($input: CreateEmailGroupInput!) {\n      createEmailGroup(input: $input) {\n        id\n        name\n        description\n        members {\n          name\n        }\n      }\n    }\n  "): (typeof documents)["\n    mutation createEmailGroup($input: CreateEmailGroupInput!) {\n      createEmailGroup(input: $input) {\n        id\n        name\n        description\n        members {\n          name\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query adminUsers($search: String, $order: UserOrderBy, $offset: Int, $showDeleted: Boolean) {\n    users(\n      filter: { role: [owner, admin, teacher], orderBy: $order, showDeleted: $showDeleted }\n      search: $search\n      offset: $offset\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  query adminUsers($search: String, $order: UserOrderBy, $offset: Int, $showDeleted: Boolean) {\n    users(\n      filter: { role: [owner, admin, teacher], orderBy: $order, showDeleted: $showDeleted }\n      search: $search\n      offset: $offset\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query adminUserById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        email\n        role\n        inviteAccepted\n      }\n    }\n  "): (typeof documents)["\n    query adminUserById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        email\n        role\n        inviteAccepted\n      }\n    }\n  "];
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
export function graphql(source: "\n    mutation forgotPassword($input: ForgotPasswordInput!) {\n      forgotPassword(input: $input) {\n        success\n      }\n    }\n  "): (typeof documents)["\n    mutation forgotPassword($input: ForgotPasswordInput!) {\n      forgotPassword(input: $input) {\n        success\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation sendInvite($id: ID!) {\n      sendUserInvite(id: $id)\n    }\n  "): (typeof documents)["\n    mutation sendInvite($id: ID!) {\n      sendUserInvite(id: $id)\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createUser($user: CreateUserInput!) {\n      createUser(input: $user) {\n        id\n        firstName\n        lastName\n      }\n    }\n  "): (typeof documents)["\n    mutation createUser($user: CreateUserInput!) {\n      createUser(input: $user) {\n        id\n        firstName\n        lastName\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query file($id: ID!) {\n      file(id: $id) {\n        id\n        name\n        fileType\n        MIMEType\n        size\n        createdAt\n      }\n    }\n  "): (typeof documents)["\n    query file($id: ID!) {\n      file(id: $id) {\n        id\n        name\n        fileType\n        MIMEType\n        size\n        createdAt\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation deleteSharedDrive($id: ID!) {\n      deleteSharedDrive(id: $id) {\n        id\n      }\n    }\n  "): (typeof documents)["\n    mutation deleteSharedDrive($id: ID!) {\n      deleteSharedDrive(id: $id) {\n        id\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createSharedDrive($name: String!) {\n      createSharedDrive(name: $name) {\n        id\n        name\n      }\n    }\n  "): (typeof documents)["\n    mutation createSharedDrive($name: String!) {\n      createSharedDrive(name: $name) {\n        id\n        name\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query buckets {\n    buckets(input: { shared: true }) {\n      edges {\n        id\n        name\n        shared\n        createdAt\n        permission\n      }\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query buckets {\n    buckets(input: { shared: true }) {\n      edges {\n        id\n        name\n        shared\n        createdAt\n        permission\n      }\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation resetPassword($input: ResetPasswordInput!) {\n      resetPassword(input: $input) {\n        success\n      }\n    }\n  "): (typeof documents)["\n    mutation resetPassword($input: ResetPasswordInput!) {\n      resetPassword(input: $input) {\n        success\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query mGetEntries($limit: Int, $order: EntrySortBy, $offset: Int) {\n    entries(limit: $limit, sortBy: $order, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        date\n        body\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query mGetEntries($limit: Int, $order: EntrySortBy, $offset: Int) {\n    entries(limit: $limit, sortBy: $order, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        date\n        body\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query competence($search: String, $limit: Int, $offset: Int, $filter: CompetenceFilterInput) {\n    competences(\n      filter: $filter\n      search: $search\n      limit: $limit\n      offset: $offset\n      sort: { field: sort_order, order: asc }\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        type\n        grades\n        color\n        sortOrder\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query competence($search: String, $limit: Int, $offset: Int, $filter: CompetenceFilterInput) {\n    competences(\n      filter: $filter\n      search: $search\n      limit: $limit\n      offset: $offset\n      sort: { field: sort_order, order: asc }\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        type\n        grades\n        color\n        sortOrder\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query zeCompetenceParents($id: ID!) {\n      competence(id: $id) {\n        id\n        name\n        type\n        grades\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  "): (typeof documents)["\n    query zeCompetenceParents($id: ID!) {\n      competence(id: $id) {\n        id\n        name\n        type\n        grades\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query competenceSubjects($search: String, $limit: Int, $offset: Int) {\n    competences(\n      filter: { type: subject }\n      search: $search\n      limit: $limit\n      offset: $offset\n      sort: { field: sort_order, order: asc }\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        type\n        grades\n        color\n        sortOrder\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query competenceSubjects($search: String, $limit: Int, $offset: Int) {\n    competences(\n      filter: { type: subject }\n      search: $search\n      limit: $limit\n      offset: $offset\n      sort: { field: sort_order, order: asc }\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        type\n        grades\n        color\n        sortOrder\n        parents {\n          id\n          name\n          type\n          grades\n        }\n      }\n    }\n  }\n"];
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
export function graphql(source: "\n    query getEntryFilterTeachers($search: String) {\n      users(filter: { role: [owner, admin, teacher, educator] }, limit: 500, search: $search) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "): (typeof documents)["\n    query getEntryFilterTeachers($search: String) {\n      users(filter: { role: [owner, admin, teacher, educator] }, limit: 500, search: $search) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getEntryFilterStudents($search: String) {\n      users(filter: { role: [student] }, limit: 200, search: $search) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "): (typeof documents)["\n    query getEntryFilterStudents($search: String) {\n      users(filter: { role: [student] }, limit: 200, search: $search) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query event($id: ID!) {\n      event(id: $id) {\n        id\n        title\n        body\n        createdAt\n        startsAt\n        endsAt\n        competences {\n          id\n          name\n          type\n          grades\n          parents {\n            id\n            name\n            type\n            grades\n            color\n          }\n        }\n      }\n    }\n  "): (typeof documents)["\n    query event($id: ID!) {\n      event(id: $id) {\n        id\n        title\n        body\n        createdAt\n        startsAt\n        endsAt\n        competences {\n          id\n          name\n          type\n          grades\n          parents {\n            id\n            name\n            type\n            grades\n            color\n          }\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query exportEvents($input: ExportEventsInput!) {\n      exportEvents(input: $input) {\n        id\n        title\n        body\n        startsAt\n        endsAt\n        subjects\n      }\n    }\n  "): (typeof documents)["\n    query exportEvents($input: ExportEventsInput!) {\n      exportEvents(input: $input) {\n        id\n        title\n        body\n        startsAt\n        endsAt\n        subjects\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query eventWithSearch($search: String, $offset: Int, $order: EventOrderBy, $filter: EventFilterInput) {\n    events(search: $search, limit: 50, offset: $offset, order: $order, filter: $filter) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        title\n        body\n        createdAt\n        startsAt\n        endsAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query eventWithSearch($search: String, $offset: Int, $order: EventOrderBy, $filter: EventFilterInput) {\n    events(search: $search, limit: 50, offset: $offset, order: $order, filter: $filter) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        title\n        body\n        createdAt\n        startsAt\n        endsAt\n      }\n    }\n  }\n"];
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
export function graphql(source: "\n  query getTagWithLimit($limit: Int, $offset: Int) {\n    tags(limit: $limit, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query getTagWithLimit($limit: Int, $offset: Int) {\n    tags(limit: $limit, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        name\n        color\n        deletedAt\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query adminStudents($search: String, $order: UserOrderBy, $offset: Int, $showDeleted: Boolean) {\n    users(filter: { role: [student], orderBy: $order, showDeleted: $showDeleted }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query adminStudents($search: String, $order: UserOrderBy, $offset: Int, $showDeleted: Boolean) {\n    users(filter: { role: [student], orderBy: $order, showDeleted: $showDeleted }, search: $search, offset: $offset) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n        }\n      }\n    }\n  }\n"];
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
export function graphql(source: "\n    mutation createStudent($student: CreateStudentInput!) {\n      createStudent(input: $student) {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  "): (typeof documents)["\n    mutation createStudent($student: CreateStudentInput!) {\n      createStudent(input: $student) {\n        id\n        firstName\n        lastName\n        student {\n          id\n          birthday\n          grade\n          leftAt\n          joinedAt\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation archiveEntry($id: ID!) {\n    archiveEntry(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation archiveEntry($id: ID!) {\n    archiveEntry(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation createEntry($input: CreateEntryInput!) {\n    createEntry(input: $input) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n        }\n      }\n    }\n  }\n"): (typeof documents)["\nmutation createEntry($input: CreateEntryInput!) {\n    createEntry(input: $input) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createSchoolYear($year: Int!) {\n    createSchoolYear(input: { year: $year }) {\n      id\n      year\n      description\n    }\n  }\n"): (typeof documents)["\n  mutation createSchoolYear($year: Int!) {\n    createSchoolYear(input: { year: $year }) {\n      id\n      year\n      description\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createSubject($name: String!) {\n    createSubject(input: { name: $name }) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createSubject($name: String!) {\n    createSubject(input: { name: $name }) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query entryById($id: ID!) {\n    entry(id: $id) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n          grades\n          parents {\n            id\n            name\n            grades\n            color\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query entryById($id: ID!) {\n    entry(id: $id) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n          grades\n          parents {\n            id\n            name\n            grades\n            color\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query events($search: String) {\n    events(limit: 100, search: $search) {\n      edges {\n        id\n        title\n      }\n    }\n  }\n"): (typeof documents)["\n  query events($search: String) {\n    events(limit: 100, search: $search) {\n      edges {\n        id\n        title\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query me {\n        me {\n            id\n            role\n        }\n    }\n"): (typeof documents)["\n    query me {\n        me {\n            id\n            role\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation resetPassword($input: ResetPasswordInput!) {\n        resetPassword(input: $input) {\n        success\n        }\n    }\n"): (typeof documents)["\n    mutation resetPassword($input: ResetPasswordInput!) {\n        resetPassword(input: $input) {\n        success\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query schoolYear($id: ID!) {\n    schoolYear(id: $id) {\n      id\n      year\n      description\n    }\n  }\n"): (typeof documents)["\n  query schoolYear($id: ID!) {\n    schoolYear(id: $id) {\n      id\n      year\n      description\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query schoolYears($limit: Int, $offset: Int) {\n    schoolYears(limit: $limit, offset: $offset) {\n      edges {\n        id\n        year\n        description\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query schoolYears($limit: Int, $offset: Int) {\n    schoolYears(limit: $limit, offset: $offset) {\n      edges {\n        id\n        year\n        description\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation signIn($email: String!, $password: String!) {\n        signIn(input: {email: $email, password: $password }) {\n            token\n            enabled_apps\n            language\n            setupComplete\n        }\n    }\n"): (typeof documents)["\n    mutation signIn($email: String!, $password: String!) {\n        signIn(input: {email: $email, password: $password }) {\n            token\n            enabled_apps\n            language\n            setupComplete\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query subject($id: ID!) {\n      subject(id: $id) {\n        id\n        name\n      }\n    }\n"): (typeof documents)["\n    query subject($id: ID!) {\n      subject(id: $id) {\n        id\n        name\n      }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query subjects($limit: Int, $offset: Int) {\n    subjects(limit: $limit, offset: $offset) {\n      edges {\n        id\n        name\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query subjects($limit: Int, $offset: Int) {\n    subjects(limit: $limit, offset: $offset) {\n      edges {\n        id\n        name\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query tagLimited($search: String) {\n    tags(limit: 100, search: $search) {\n      edges {\n        id\n        name\n        color\n      }\n    }\n  }\n"): (typeof documents)["\n  query tagLimited($search: String) {\n    tags(limit: 100, search: $search) {\n      edges {\n        id\n        name\n        color\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation updateEntry($input: UpdateEntryInput!) {\n    updateEntry(input: $input) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n        }\n      }\n    }\n  }\n  "): (typeof documents)["\nmutation updateEntry($input: UpdateEntryInput!) {\n    updateEntry(input: $input) {\n      id\n      date\n      body\n      deletedAt\n      user {\n        id\n        firstName\n        lastName\n      }\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n      events {\n        id\n        title\n      }\n      users {\n        id\n        firstName\n        lastName\n      }\n      userCompetences {\n        id\n        level\n        competence {\n          id\n          name\n          color\n          type\n        }\n      }\n    }\n  }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateSchoolYear($id: ID!, $year: Int!) {\n    updateSchoolYear(input: { id: $id, year: $year }) {\n      id\n      year\n      description\n    }\n  }\n"): (typeof documents)["\n  mutation updateSchoolYear($id: ID!, $year: Int!) {\n    updateSchoolYear(input: { id: $id, year: $year }) {\n      id\n      year\n      description\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateSubject($id: ID!, $name: String!) {\n        updateSubject(input: { id: $id, name: $name }) {\n            id\n            name\n        }\n    }\n"): (typeof documents)["\n    mutation updateSubject($id: ID!, $name: String!) {\n        updateSubject(input: { id: $id, name: $name }) {\n            id\n            name\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateUserStudentGrade($id: ID!, $grade: Int!) {\n    updateUserStudentGrade(input: { id: $id, grade: $grade }) {\n      id\n      grade\n    }\n  }\n"): (typeof documents)["\n  mutation updateUserStudentGrade($id: ID!, $grade: Int!) {\n    updateUserStudentGrade(input: { id: $id, grade: $grade }) {\n      id\n      grade\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query userStudentGrade($id: ID!) {\n      userStudentGrade(id: $id) {\n        id\n        grade\n        student {\n          id\n          user {\n            id\n            firstName\n            lastName\n          }\n        }\n        subject {\n          id\n          name\n        }\n        schoolYear {\n          id\n          year\n          description\n        }\n      }\n    }\n"): (typeof documents)["\n    query userStudentGrade($id: ID!) {\n      userStudentGrade(id: $id) {\n        id\n        grade\n        student {\n          id\n          user {\n            id\n            firstName\n            lastName\n          }\n        }\n        subject {\n          id\n          name\n        }\n        schoolYear {\n          id\n          year\n          description\n        }\n      }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query userStudentGrades($limit: Int, $offset: Int) {\n    userStudentGrades(limit: $limit, offset: $offset) {\n      edges {\n        id\n        grade\n        student {\n          id\n          user {\n            id\n            firstName\n            lastName\n          }\n        }\n        subject {\n          id\n          name\n        }\n        schoolYear {\n          id\n          year\n          description\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query userStudentGrades($limit: Int, $offset: Int) {\n    userStudentGrades(limit: $limit, offset: $offset) {\n      edges {\n        id\n        grade\n        student {\n          id\n          user {\n            id\n            firstName\n            lastName\n          }\n        }\n        subject {\n          id\n          name\n        }\n        schoolYear {\n          id\n          year\n          description\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
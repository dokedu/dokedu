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
    "\n  mutation createEntry($input: CreateEntryInput!) {\n    createEntry(input: $input) {\n      id\n      date\n      body\n      createdAt\n    }\n  }\n": types.CreateEntryDocument,
    "\n  mutation updateEntry($input: UpdateEntryInput!) {\n    updateEntry(input: $input) {\n      id\n      date\n      body\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n    }\n  }\n": types.UpdateEntryDocument,
    "\n    query competences($search: String, $filter: CompetenceFilterInput) {\n      competences(search: $search, filter: $filter) {\n        edges {\n          id\n          name\n          type\n          color\n          grades\n        }\n      }\n    }\n  ": types.CompetencesDocument,
    "\n     query events {\n      events {\n        edges {\n          id\n          title\n        }\n      }\n    }\n  ": types.EventsDocument,
    "\n    query users {\n      users(filter: { role: [student] }) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  ": types.UsersDocument,
    "\n    query entryById($id: ID!) {\n      entry(id: $id) {\n        id\n        date\n        body\n        deletedAt\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        tags {\n          id\n          name\n          color\n        }\n        events {\n          id\n          title\n        }\n        users {\n          id\n          firstName\n          lastName\n        }\n        userCompetences {\n          id\n          level\n          competence {\n            id\n            name\n            color\n            type\n          }\n        }\n      }\n    }\n  ": types.EntryByIdDocument,
    "\n    query userById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        role\n      }\n    }\n  ": types.UserByIdDocument,
    "\n  mutation archiveEntry($id: ID!) {\n    archiveEntry(id: $id) {\n      id\n    }\n  }\n": types.ArchiveEntryDocument,
    "\n    mutation signIn($email: String!, $password: String!) {\n        signIn(input: {email: $email, password: $password }) {\n            token\n        }\n    }\n": types.SignInDocument,
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
export function graphql(source: "\n  mutation createEntry($input: CreateEntryInput!) {\n    createEntry(input: $input) {\n      id\n      date\n      body\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation createEntry($input: CreateEntryInput!) {\n    createEntry(input: $input) {\n      id\n      date\n      body\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateEntry($input: UpdateEntryInput!) {\n    updateEntry(input: $input) {\n      id\n      date\n      body\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateEntry($input: UpdateEntryInput!) {\n    updateEntry(input: $input) {\n      id\n      date\n      body\n      createdAt\n      tags {\n        id\n        name\n        color\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query competences($search: String, $filter: CompetenceFilterInput) {\n      competences(search: $search, filter: $filter) {\n        edges {\n          id\n          name\n          type\n          color\n          grades\n        }\n      }\n    }\n  "): (typeof documents)["\n    query competences($search: String, $filter: CompetenceFilterInput) {\n      competences(search: $search, filter: $filter) {\n        edges {\n          id\n          name\n          type\n          color\n          grades\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n     query events {\n      events {\n        edges {\n          id\n          title\n        }\n      }\n    }\n  "): (typeof documents)["\n     query events {\n      events {\n        edges {\n          id\n          title\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query users {\n      users(filter: { role: [student] }) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "): (typeof documents)["\n    query users {\n      users(filter: { role: [student] }) {\n        edges {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query entryById($id: ID!) {\n      entry(id: $id) {\n        id\n        date\n        body\n        deletedAt\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        tags {\n          id\n          name\n          color\n        }\n        events {\n          id\n          title\n        }\n        users {\n          id\n          firstName\n          lastName\n        }\n        userCompetences {\n          id\n          level\n          competence {\n            id\n            name\n            color\n            type\n          }\n        }\n      }\n    }\n  "): (typeof documents)["\n    query entryById($id: ID!) {\n      entry(id: $id) {\n        id\n        date\n        body\n        deletedAt\n        user {\n          id\n          firstName\n          lastName\n        }\n        createdAt\n        tags {\n          id\n          name\n          color\n        }\n        events {\n          id\n          title\n        }\n        users {\n          id\n          firstName\n          lastName\n        }\n        userCompetences {\n          id\n          level\n          competence {\n            id\n            name\n            color\n            type\n          }\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query userById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        role\n      }\n    }\n  "): (typeof documents)["\n    query userById($id: ID!) {\n      user(id: $id) {\n        id\n        firstName\n        lastName\n        role\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation archiveEntry($id: ID!) {\n    archiveEntry(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation archiveEntry($id: ID!) {\n    archiveEntry(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation signIn($email: String!, $password: String!) {\n        signIn(input: {email: $email, password: $password }) {\n            token\n        }\n    }\n"): (typeof documents)["\n    mutation signIn($email: String!, $password: String!) {\n        signIn(input: {email: $email, password: $password }) {\n            token\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
import type * as Types from "../../schema.ts";

import gql from "graphql-tag";
import * as Urql from "@urql/vue";
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AdminUserByIdQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type AdminUserByIdQuery = { __typename?: "Query" } & {
  user: { __typename?: "User" } & Pick<
    Types.User,
    "id" | "firstName" | "lastName" | "email" | "role" | "inviteAccepted"
  >;
};

export const AdminUserByIdDocument = gql`
  query adminUserById($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      role
      inviteAccepted
    }
  }
`;

export function useAdminUserByIdQuery(options: Omit<Urql.UseQueryArgs<never, AdminUserByIdQueryVariables>, "query">) {
  return Urql.useQuery<AdminUserByIdQuery, AdminUserByIdQueryVariables>({ query: AdminUserByIdDocument, ...options });
}

import type * as Types from "../../schema.ts";

import gql from "graphql-tag";
import * as Urql from "@urql/vue";
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FileByIdQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type FileByIdQuery = { __typename?: "Query" } & {
  file: { __typename?: "File" } & Pick<Types.File, "id" | "name"> & {
      parents: Array<{ __typename?: "File" } & Pick<Types.File, "id" | "name">>;
    };
};

export const FileByIdDocument = gql`
  query fileById($id: ID!) {
    file(id: $id) {
      id
      name
      parents {
        id
        name
      }
    }
  }
`;

export function useFileByIdQuery(options: Omit<Urql.UseQueryArgs<never, FileByIdQueryVariables>, "query">) {
  return Urql.useQuery<FileByIdQuery, FileByIdQueryVariables>({ query: FileByIdDocument, ...options });
}

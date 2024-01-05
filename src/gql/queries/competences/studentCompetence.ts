import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type StudentCompetenceQueryVariables = Types.Exact<{
  competenceId: Types.Scalars["ID"]["input"]
  user: Types.Scalars["ID"]["input"]
}>

export type StudentCompetenceQuery = { __typename?: "Query" } & {
  competence: { __typename?: "Competence" } & Pick<Types.Competence, "id" | "name"> & {
      parents: Array<{ __typename?: "Competence" } & Pick<Types.Competence, "id" | "name">>
      competences: Array<
        Types.Maybe<
          { __typename?: "Competence" } & Pick<Types.Competence, "type" | "id" | "name" | "grades"> & {
              parents: Array<{ __typename?: "Competence" } & Pick<Types.Competence, "id" | "name">>
              tendency?: Types.Maybe<
                { __typename?: "CompetenceTendency" } & Pick<
                  Types.CompetenceTendency,
                  "tendency" | "countChildCompetences" | "countLearnedCompetences"
                >
              >
              userCompetences: Array<
                Types.Maybe<
                  { __typename?: "UserCompetence" } & Pick<Types.UserCompetence, "id" | "level" | "createdAt"> & {
                      entry?: Types.Maybe<{ __typename?: "Entry" } & Pick<Types.Entry, "id">>
                      createdBy?: Types.Maybe<{ __typename?: "User" } & Pick<Types.User, "firstName" | "lastName">>
                    }
                >
              >
            }
        >
      >
    }
}

export const StudentCompetenceDocument = gql`
  query studentCompetence($competenceId: ID!, $user: ID!) {
    competence(id: $competenceId) {
      id
      name
      parents {
        id
        name
      }
      competences(sort: { field: sort_order, order: asc }) {
        type
        id
        name
        grades
        parents {
          id
          name
        }
        tendency(userId: $user) {
          tendency
          countChildCompetences
          countLearnedCompetences
        }
        userCompetences(userId: $user) {
          id
          level
          entry {
            id
          }
          createdBy {
            firstName
            lastName
          }
          createdAt
        }
      }
    }
  }
`

export function useStudentCompetenceQuery(
  options: Omit<Urql.UseQueryArgs<never, StudentCompetenceQueryVariables>, "query">
) {
  return Urql.useQuery<StudentCompetenceQuery, StudentCompetenceQueryVariables>({
    query: StudentCompetenceDocument,
    ...options
  })
}

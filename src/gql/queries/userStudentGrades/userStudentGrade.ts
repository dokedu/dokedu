import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type UserStudentGradeQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"]
}>

export type UserStudentGradeQuery = { __typename?: "Query" } & {
  userStudentGrade: { __typename?: "UserStudentGrades" } & Pick<Types.UserStudentGrades, "id" | "grade"> & {
      student: { __typename?: "UserStudent" } & Pick<Types.UserStudent, "id"> & {
          user: { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName">
        }
      subject: { __typename?: "Subject" } & Pick<Types.Subject, "id" | "name">
      schoolYear: { __typename?: "SchoolYear" } & Pick<Types.SchoolYear, "id" | "year" | "description">
    }
}

export const UserStudentGradeDocument = gql`
  query userStudentGrade($id: ID!) {
    userStudentGrade(id: $id) {
      id
      grade
      student {
        id
        user {
          id
          firstName
          lastName
        }
      }
      subject {
        id
        name
      }
      schoolYear {
        id
        year
        description
      }
    }
  }
`

export function useUserStudentGradeQuery(
  options: Omit<Urql.UseQueryArgs<never, UserStudentGradeQueryVariables>, "query">
) {
  return Urql.useQuery<UserStudentGradeQuery, UserStudentGradeQueryVariables>({
    query: UserStudentGradeDocument,
    ...options
  })
}

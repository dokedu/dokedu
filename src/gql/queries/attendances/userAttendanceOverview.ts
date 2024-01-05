import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type UserAttendanceOverviewQueryVariables = Types.Exact<{
  date: Types.Scalars["Time"]["input"]
}>

export type UserAttendanceOverviewQuery = { __typename?: "Query" } & {
  userAttendanceOverview: Array<
    { __typename?: "UserAttendance" } & Pick<Types.UserAttendance, "id" | "date" | "state"> & {
        user: { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName">
      }
  >
}

export const UserAttendanceOverviewDocument = gql`
  query userAttendanceOverview($date: Time!) {
    userAttendanceOverview(date: $date) {
      id
      date
      state
      user {
        id
        firstName
        lastName
      }
    }
  }
`

export function useUserAttendanceOverviewQuery(
  options: Omit<Urql.UseQueryArgs<never, UserAttendanceOverviewQueryVariables>, "query">
) {
  return Urql.useQuery<UserAttendanceOverviewQuery, UserAttendanceOverviewQueryVariables>({
    query: UserAttendanceOverviewDocument,
    ...options
  })
}

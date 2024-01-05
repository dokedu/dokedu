import type * as Types from "../../schema"

import gql from "graphql-tag"
import * as Urql from "@urql/vue"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type UpdateDailyAttendanceMutationVariables = Types.Exact<{
  date: Types.Scalars["Time"]["input"]
  state: Types.UserAttendanceState
}>

export type UpdateDailyAttendanceMutation = { __typename?: "Mutation" } & {
  updateDailyAttendance: Array<
    { __typename?: "UserAttendance" } & Pick<Types.UserAttendance, "id" | "date" | "state"> & {
        user: { __typename?: "User" } & Pick<Types.User, "id" | "firstName" | "lastName">
      }
  >
}

export const UpdateDailyAttendanceDocument = gql`
  mutation updateDailyAttendance($date: Time!, $state: UserAttendanceState!) {
    updateDailyAttendance(date: $date, state: $state) {
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

export function useUpdateDailyAttendanceMutation() {
  return Urql.useMutation<UpdateDailyAttendanceMutation, UpdateDailyAttendanceMutationVariables>(
    UpdateDailyAttendanceDocument
  )
}

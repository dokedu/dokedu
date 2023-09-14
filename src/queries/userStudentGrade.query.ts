import { graphql } from "@/gql";

export default graphql(`
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
`)
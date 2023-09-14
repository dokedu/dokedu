import { graphql } from "@/gql";

export default graphql(`
  query userStudentGrades($limit: Int, $offset: Int) {
    userStudentGrades(limit: $limit, offset: $offset) {
      edges {
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
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

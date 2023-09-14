import { graphql } from "@/gql";

export default graphql(`
  mutation updateUserStudentGrade($id: ID!, $grade: Int!) {
    updateUserStudentGrade(input: { id: $id, grade: $grade }) {
      id
      grade
    }
  }
`);

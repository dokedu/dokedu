import { graphql } from "@/gql";

export default graphql(`
  mutation updateSchoolYear($id: ID!, $year: Int!) {
    updateSchoolYear(input: { id: $id, year: $year }) {
      id
      year
      description
    }
  }
`);

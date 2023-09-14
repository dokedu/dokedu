import { graphql } from "@/gql";

export default graphql(`
  query schoolYear($id: ID!) {
    schoolYear(id: $id) {
      id
      year
      description
    }
  }
`);

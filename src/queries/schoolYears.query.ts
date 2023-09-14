import { graphql } from "@/gql";

export default graphql(`
  query schoolYears($limit: Int, $offset: Int) {
    schoolYears(limit: $limit, offset: $offset) {
      edges {
        id
        year
        description
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

import { graphql } from "@/gql";

export default graphql(`
  query subjects($limit: Int, $offset: Int) {
    subjects(limit: $limit, offset: $offset) {
      edges {
        id
        name
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

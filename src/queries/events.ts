import { gql } from "@urql/vue";

export default gql`
  query events($search: String) {
    events(limit: 100, search: $search) {
      edges {
        id
        title
      }
    }
  }
`;

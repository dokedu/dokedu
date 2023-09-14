import { gql } from "@urql/vue";

export default gql`
  query tagLimited($search: String) {
    tags(limit: 100, search: $search) {
      edges {
        id
        name
        color
      }
    }
  }
`;

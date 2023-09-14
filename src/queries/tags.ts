import { gql } from "@urql/vue";

export default gql`
  query tagLimited {
    tags(limit: 1000) {
      edges {
        id
        name
        color
      }
    }
  }
`;

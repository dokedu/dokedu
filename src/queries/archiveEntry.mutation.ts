import { gql } from "@urql/vue";

export default gql`
  mutation archiveEntry($id: ID!) {
    archiveEntry(id: $id) {
      id
    }
  }
`;

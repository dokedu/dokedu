import { gql } from "@urql/vue";

export default gql`
  query me {
    me {
      id
      role
    }
  }
`;

import { graphql } from "@/gql";

export default graphql(`
    query subject($id: ID!) {
      subject(id: $id) {
        id
        name
      }
    }
`)
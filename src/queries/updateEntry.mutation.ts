import { graphql } from "@/gql";

export default graphql(`
  mutation updateEntry($input: UpdateEntryInput!) {
    updateEntry(input: $input) {
      id
    }
  }
`);

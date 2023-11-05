import { graphql } from "@/gql";

export default graphql(`
  mutation deleteEntryTagInput($input: DeleteEntryTagInput!) {
    deleteEntryTag(input: $input) {
      id
    }
  }
`);

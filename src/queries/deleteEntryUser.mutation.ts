import { graphql } from "@/gql";

export default graphql(`
  mutation deleteEntryUserInput($input: DeleteEntryUserInput!) {
    deleteEntryUser(input: $input) {
      id
    }
  }
`);

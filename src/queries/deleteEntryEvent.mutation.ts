import { graphql } from "@/gql";

export default graphql(`
  mutation deleteEntryEventInput($input: DeleteEntryEventInput!) {
    deleteEntryEvent(input: $input) {
      id
    }
  }
`);

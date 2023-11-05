import { graphql } from "@/gql";

export default graphql(`
  mutation createEntryDraft {
    createEntry {
      id
    }
  }
`);

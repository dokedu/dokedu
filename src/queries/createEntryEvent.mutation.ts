import { graphql } from "@/gql";

export default graphql(`
  mutation createEntryEvent($input: CreateEntryEventInput!) {
    createEntryEvent(input: $input) {
      id
    }
  }
`);

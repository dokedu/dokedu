import { graphql } from "@/gql";

export default graphql(`
  mutation createEntryTag($input: CreateEntryTagInput!) {
    createEntryTag(input: $input) {
      id
    }
  }
`);

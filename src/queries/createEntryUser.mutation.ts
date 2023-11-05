import { graphql } from "@/gql";

export default graphql(`
  mutation createEntryUser($input: CreateEntryUserInput!) {
    createEntryUser(input: $input) {
      id
    }
  }
`);

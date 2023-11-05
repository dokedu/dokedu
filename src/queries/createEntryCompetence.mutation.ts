import { graphql } from "@/gql";

export default graphql(`
  mutation createEntryCompetence($input: CreateEntryCompetenceInput!) {
    createEntryCompetence(input: $input) {
      id
    }
  }
`);

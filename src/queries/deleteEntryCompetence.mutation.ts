import { graphql } from "@/gql";

export default graphql(`
  mutation deleteEntryCompetenceInput($input: DeleteEntryCompetenceInput!) {
    deleteEntryCompetence(input: $input) {
      id
    }
  }
`);

import { graphql } from "@/gql";

export default graphql(`
  mutation updateEntryUserCompetenceLevel($input: UpdateEntryUserCompetenceLevel!) {
    updateEntryUserCompetenceLevel(input: $input) {
      id
    }
  }
`);

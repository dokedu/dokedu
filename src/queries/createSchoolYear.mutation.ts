import { graphql } from "@/gql";

export default graphql(`
  mutation createSchoolYear($year: Int!) {
    createSchoolYear(input: { year: $year }) {
      id
      year
      description
    }
  }
`);

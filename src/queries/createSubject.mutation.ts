import { graphql } from "@/gql";

export default graphql(`
  mutation createSubject($name: String!) {
    createSubject(input: { name: $name }) {
      id
      name
    }
  }
`);

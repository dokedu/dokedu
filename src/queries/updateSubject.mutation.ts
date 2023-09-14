import { graphql } from "@/gql";

export default graphql(`
    mutation updateSubject($id: ID!, $name: String!) {
        updateSubject(input: { id: $id, name: $name }) {
            id
            name
        }
    }
`)
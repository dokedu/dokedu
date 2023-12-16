import { graphql } from "@/gql";

export default graphql(`
  mutation resetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
    }
  }
`);

import {gql} from '@urql/vue';

export default gql`
    mutation signIn($email: String!, $password: String!) {
        signIn(input: {email: $email, password: $password }) {
            token
        }
    }
`
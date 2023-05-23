import {gql} from '@urql/vue';

export default gql`
    query {
        tags {
            id
            name
            color
        }
    }
`
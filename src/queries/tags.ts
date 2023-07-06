import {gql} from '@urql/vue';

export default gql`
    query {
        tags(limit:1000) {
            edges {
            id
            name
            color
            }
        }
    }
`
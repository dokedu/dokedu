import { graphql } from "@/gql";

export default graphql(`
  query entryById($id: ID!) {
    entry(id: $id) {
      id
      date
      body
      deletedAt
      user {
        id
        firstName
        lastName
      }
      createdAt
      tags {
        id
        name
        color
      }
      events {
        id
        title
      }
      users {
        id
        firstName
        lastName
      }
      userCompetences {
        id
        level
        competence {
          id
          name
          color
          type
          grades
          parents {
            id
            name
            grades
            color
          }
        }
      }
    }
  }
`);
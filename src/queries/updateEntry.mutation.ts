import { graphql } from "@/gql";


export default graphql(`
mutation updateEntry($input: UpdateEntryInput!) {
    updateEntry(input: $input) {
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
        }
      }
    }
  }
  `)
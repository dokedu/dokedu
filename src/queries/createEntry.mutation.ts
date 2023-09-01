import { graphql } from "@/gql";


export default graphql(`
mutation createEntry($input: CreateEntryInput!) {
    createEntry(input: $input) {
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
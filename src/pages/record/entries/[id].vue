<template>
  <PageWrapper>
    <EntryForm v-if="entry" :entry="entry.entry" mode="edit" @archived="archived" @saved="saved" />
  </PageWrapper>
</template>
<script setup lang="ts">
import PageWrapper from "../../../components/PageWrapper.vue";
import EntryForm from "./EntryForm.vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@urql/vue";
import { graphql } from "../../../gql";

const router = useRouter();
const route = useRoute();

async function archived() {
  await router.push({ name: "record-entries" });
}

function saved() {}

const { data: entry } = useQuery({
  query: graphql(`
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
            }
          }
        }
      }
    }
  `),
  variables: { id: route.params.id as string },
});
</script>

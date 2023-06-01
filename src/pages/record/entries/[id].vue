<template>
  <PageWrapper>
    <EntryForm v-if="entry" :entry="entry.entry" mode="edit" @archived="archived" @saved="saved" />
  </PageWrapper>
</template>
<script setup lang="ts">
import PageWrapper from "../../../components/PageWrapper.vue";
import EntryForm from "./EntryForm.vue";
import { useRoute, useRouter } from "vue-router";
import { gql, useQuery } from "@urql/vue";

const router = useRouter();
const route = useRoute();

async function archived() {
  await router.push({ name: "record-entries" });
}

function saved() {
  router.push({ name: "record-entries" });
}

const { data: entry } = useQuery({
  query: gql`
    query entry($id: ID!) {
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
      }
    }
  `,
  variables: { id: route.params.id },
});
</script>

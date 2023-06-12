<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="font-medium text-stone-950">
        <router-link :to="{ name: 'record-projects' }">Projects</router-link>
      </div>
      <div class="flex gap-2">
        <button type="button"
          class="rounded-md bg-red-100 px-6 py-1.5 text-red-700 transition-all hover:bg-red-200 hover:text-red-800">
          Delete
        </button>
        <button type="button" class="rounded-md bg-black px-6 py-1.5 text-white">
          Edit
        </button>
      </div>
    </PageHeader>
    <PageContent>
      <div class="px-8 py-4">
        <pre>{{ data }}</pre>
      </div>
    </PageContent>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import PageContent from "../../../components/PageContent.vue";
import { gql, useQuery } from "@urql/vue";
import { useRoute } from "vue-router";

const route = useRoute()

const { data } = useQuery({
  query: gql`
    query event($id: ID!) {
      event(id: $id) {
        id
        title
        body
        createdAt
        startsAt
        endsAt
      }
    }
  `,
  variables: {
    id: route.params.id,
  },
});
</script>
  
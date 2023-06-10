<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="font-medium text-gray-950">Projects</div>
      <div class="flex gap-2">
        <button type="button"
          class="rounded-md bg-gray-50 px-6 py-1.5 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-800">
          Export
        </button>
        <router-link :to="{ name: 'record-entries-new' }" class="rounded-md bg-black px-6 py-1.5 text-white">
          New project
        </router-link>
      </div>
    </PageHeader>
    <PageContent>
      <div class="flex flex-col overflow-scroll">
        <router-link :to="{ name: 'record-projects-project', params: { id: event.id } }"
          v-for="event in data?.events?.edges" class="flex border-b transition-all hover:bg-gray-50">
          <div class="w-1/4 p-2 pl-8 font-semibold">{{ event.title }}</div>
          <div class="w-2/4 p-2 pl-8">{{ event.body }}</div>
          <div class="w-1/4 p-2 px-4">{{ formatDate(new Date(Date.parse(event.startsAt)), "DD.MM.YYYY") }} - {{
            formatDate(new Date(Date.parse(event.endsAt)), "DD.MM.YYYY") }}</div>
        </router-link>
      </div>
    </PageContent>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import PageContent from "../../../components/PageContent.vue";
import { gql, useQuery } from "@urql/vue";
import { formatDate } from "@vueuse/core";

const { data } = useQuery({
  query: gql`
    query {
      events {
        edges {
          id
          title
          body
          createdAt
          startsAt
          endsAt
        }
      }
    }
  `,
});
</script>

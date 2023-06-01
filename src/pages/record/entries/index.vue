<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="font-medium text-gray-950">Entries</div>
      <div class="flex gap-2">
        <router-link :to="{ name: 'record-entries-new' }" class="rounded-md bg-black px-6 py-1.5 text-white">
          Create entry
        </router-link>
      </div>
    </PageHeader>
    <div class="flex flex-col">
      <router-link
        :to="{ name: 'record-entry', params: { id: entry.id } }"
        v-for="entry in data?.entries?.edges"
        class="flex border-b transition-all hover:bg-gray-50"
      >
        <div class="w-full p-2 pl-8">{{ entry.body.slice(0, 70) }} {{ entry.body.length > 70 ? "..." : "" }}</div>
        <div class="w-1/4 p-2">{{ dateOnly(entry.date) }}</div>
        <div class="w-1/4 p-2">
          {{ `${entry.user.firstName} ${entry.user.lastName}` }}
        </div>
      </router-link>
    </div>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import { gql, useQuery } from "@urql/vue";

const { data } = useQuery({
  query: gql`
    query {
      entries {
        edges {
          id
          date
          body
          user {
            id
            firstName
            lastName
          }
          createdAt
        }
      }
    }
  `,
});

function dateOnly(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };
  return new Date(date).toLocaleDateString("de-DE", options);
}
</script>

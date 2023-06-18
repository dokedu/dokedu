<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="font-medium text-strong">Entries</div>
      <div class="flex gap-2">
        <router-link :to="{ name: 'record-entries-new' }">
          <DButton type="primary" size="md" :icon-left="Plus">New</DButton>
        </router-link>
      </div>
    </PageHeader>
    <div class="flex flex-col overflow-scroll">
      <router-link
        :to="{ name: 'record-entries-entry', params: { id: entry.id } }"
        v-for="entry in data?.entries?.edges"
        class="flex border-b border-stone-100 text-sm text-strong transition-all hover:bg-stone-50"
      >
        <div class="line-clamp-1 h-[2rem] w-full p-2 pl-8">{{ entry.body }}</div>
        <div class="w-[200px] p-2 text-right text-subtle">{{ dateOnly(entry.date) }}</div>
        <div class="w-[400px] p-2 pr-8 text-right text-subtle">
          {{ `${entry.user.firstName} ${entry.user.lastName}` }}
        </div>
      </router-link>
      <div
        v-if="!data?.entries?.edges || data?.entries?.edges.length === 0"
        class="select-none px-8 py-4 text-sm text-default"
      >
        You can create your first entry by clicking the "New" button above.
      </div>
    </div>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import { gql, useQuery } from "@urql/vue";
import DButton from "../../../components/d-button/d-button.vue";
import { Plus } from "lucide-vue-next";

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

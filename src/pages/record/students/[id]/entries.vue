<template>
  <div class="grid grid-cols-3 gap-2">
    <router-link
      :to="{ name: 'record-entries-entry', params: { id: entry?.id } }"
      v-for="entry in data?.entries.edges"
      class="flex flex-col justify-between space-y-4 rounded-lg border border-stone-200 p-6"
    >
      <div class="space-y-4">
        <div class="text-sm text-subtle">
          {{ formatDate(new Date(Date.parse(entry?.date as string)), "DD.MM.YYYY HH:MM") }}
        </div>
        <div class="text-medium line-clamp-3 text-sm text-strong">
          {{ entry?.body }}
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
          {{ entry?.user.firstName[0] }}{{ entry?.user.lastName[0] }}
        </div>
        <div class="text-sm text-subtle">{{ entry?.user.firstName }} {{ entry?.user.lastName }}</div>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import { useRoute } from "vue-router";
import { computed, reactive } from "vue";
import { formatDate } from "@vueuse/core";

const route = useRoute();
const id = computed(() => route.params.id as string);

const { data } = useQuery({
  query: graphql(`
    query studentEntries($filter: EntryFilterInput, $limit: Int) {
      entries(filter: $filter, limit: $limit) {
        edges {
          id
          date
          body
          user {
            id
            firstName
            lastName
          }
        }
      }
    }
  `),
  variables: reactive({ filter: { users: id }, limit: 3 }),
});
</script>

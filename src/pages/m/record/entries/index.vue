<template>
  <div class="flex h-screen w-full flex-col">
    <MPageHeader />
    <div class="flex-1 divide-y divide-stone-200 overflow-scroll text-sm">
      <router-link
        v-for="entry in data?.entries.edges"
        :to="{ name: '/m/record/entries/[id]', params: { id: `${entry?.id}` } }"
        class="flex flex-col gap-2 p-4 text-stone-700"
      >
        <div class="line-clamp-3">
          {{ entry?.body }}
        </div>
        <div class="flex gap-1 text-xs text-stone-500">
          <div>{{ `${entry?.user.firstName} ${entry?.user.lastName}` }}</div>
          <div>⋅</div>
          <div>{{ toLocateDateString(entry?.createdAt) }}</div>
        </div>
      </router-link>
    </div>
    <MPageFooter>
      <router-link
        to="/m/record/entries/new"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-8 py-2.5 text-center text-sm text-white"
      >
        <Plus :size="18" />
        <div>Eintrag erstellen</div>
      </router-link>
    </MPageFooter>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "layout": "mobile"
  }
}
</route>

<script lang="ts" setup>
import MPageHeader from "@/components/mobile/m-page-header.vue";
import MPageFooter from "@/components/mobile/m-page-footer.vue";
import { Plus } from "lucide-vue-next";
import { graphql } from "@/gql";
import { useQuery } from "@urql/vue";

const query = graphql(`
  query mGetEntries($filter: EntryFilterInput, $limit: Int, $order: EntrySortBy, $offset: Int) {
    entries(filter: $filter, limit: $limit, sortBy: $order, offset: $offset) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
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
`);

const { data } = useQuery({
  query,
});

function toLocateDateString(date: string) {
  return new Date(date).toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
</script>

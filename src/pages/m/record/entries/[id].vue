<template>
  <div class="flex h-screen max-h-screen w-full flex-col" style="height: -webkit-fill-available">
    <MPageHeader />
    <template v-if="!fetching && data?.entry">
      <MEntryForm :entry="data?.entry" />
    </template>
    <div v-else class="flex-1 divide-y divide-stone-200 overflow-scroll text-sm">
      <div class="h-screen"></div>
    </div>
    <MPageFooter>
      <router-link
        to="/m/record/entries"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-8 py-2.5 text-center text-sm text-white"
      >
        <div>Speichern</div>
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
import MEntryForm from "@/components/MEntryForm.vue";
import { useRoute } from "vue-router/auto";
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";

const route = useRoute("/m/record/entries/[id]");

const query = graphql(`
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
            color
          }
        }
      }
    }
  }
`);

const { data, fetching } = useQuery({
  query,
  variables: {
    id: route.params.id,
  },
});
</script>

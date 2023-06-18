<template>
  <div
    ref="sheet"
    class="absolute right-0 top-0 h-screen w-full max-w-xl overflow-scroll bg-white shadow-md shadow-stone-300"
  >
    <div v-if="data?.event" class="p-4">
      <d-project-form :project="(data?.event as Event)" :cancel="data?.event" @cancel="cancel" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside, onKeyStroke } from "@vueuse/core";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import DProjectForm from "./DProjectForm.vue";
import { useQuery } from "@urql/vue";
import { graphql } from "../../../gql";
import { Event } from "@/gql/graphql";

const route = useRoute();
const router = useRouter();
const sheet = ref<HTMLElement | null>(null);

async function cancel() {
  await router.push({ name: "record-projects" });
}

onClickOutside(sheet, async () => {
  await cancel();
});

onKeyStroke("Escape", async () => {
  await cancel();
});

const { data } = useQuery({
  query: graphql(`
    query event($id: ID!) {
      event(id: $id) {
        id
        title
        body
        createdAt
        startsAt
        endsAt
        competences {
          id
          name
          type
          grades
          parents {
            id
            name
            type
            grades
          }
        }
      }
    }
  `),
  variables: reactive({
    id: route.params.id as string,
  }),
});
</script>

<template>
  <div
    ref="sheet"
    class="absolute right-0 top-0 h-screen w-full max-w-xl overflow-scroll bg-white shadow-md shadow-stone-300"
  >
    <div v-if="data?.event" class="p-4">
      <d-project-form :project="data?.event" :cancel="data?.event" @cancel="cancel" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside, onKeyStroke } from "@vueuse/core";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import DProjectForm from "./DProjectForm.vue";
import { useMutation, useQuery } from "@urql/vue";
import { graphql } from "../../../gql";

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
  variables: {
    id: route.params.id,
  },
});

async function deleteEvent() {
  if (confirm("Are you sure you want to delete this project?")) {
    await archiveEvent({ id: route.params.id });
    await router.push({ name: "record-projects" });
  }
}
const { executeMutation: archiveEvent } = useMutation(
  graphql(`
    mutation archiveEvent($id: ID!) {
      archiveEvent(id: $id) {
        id
      }
    }
  `)
);
</script>

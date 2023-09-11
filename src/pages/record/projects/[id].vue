<template>
  <div v-if="data?.event" class="h-full w-full">
    <d-project-form :project="(data?.event as Event)" :cancel="data?.event" @cancel="cancel" @save="save" />
  </div>
</template>

<script lang="ts" setup>
import { onKeyStroke } from "@vueuse/core";
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router/auto";
import DProjectForm from "@/components/d-project-form.vue";
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import { Event } from "@/gql/graphql";

const route = useRoute<"/record/projects/[id]">();
const router = useRouter();

async function cancel() {
  await router.push({ name: "/record/projects/" });
}

async function save() {
  if (route.name === "/record/projects/[id]") return;
  await router.push({ name: "/record/projects/" });
}

onKeyStroke("Escape", async () => {
  if (route.name === "/record/projects/[id]") return;
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
            color
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

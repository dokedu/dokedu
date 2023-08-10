<template>
  <d-project-form :project="(project as Event)" @cancel="cancel" />
</template>

<script lang="ts" setup>
import { onClickOutside, onKeyStroke } from "@vueuse/core";
import { ref } from "vue";
import { useRouter } from "vue-router/auto";
import DProjectForm from "@/components/DProjectForm.vue";
import { Event } from "@/gql/graphql";

const router = useRouter();
const sheet = ref<HTMLElement | null>(null);

async function cancel() {
  await router.push({ name: "/record/projects/" });
}

// @ts-expect-error
const project = ref<Event>({
  title: "",
  body: "",
  startsAt: new Date().toISOString(),
  endsAt: new Date().toISOString(),
  competences: [],
});

onClickOutside(sheet, async () => {
  await cancel();
});

onKeyStroke("Escape", async () => {
  await cancel();
});
</script>

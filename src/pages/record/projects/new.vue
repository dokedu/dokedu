<template>
  <div
    ref="sheet"
    class="absolute right-0 top-0 h-screen w-full max-w-xl overflow-scroll bg-white shadow-md shadow-stone-300"
  >
    <div class="p-4">
      <d-project-form :project="(project as Event)" @cancel="cancel" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside, onKeyStroke } from "@vueuse/core";
import { ref } from "vue";
import { useRouter } from "vue-router";
import DProjectForm from "./DProjectForm.vue";
import { Event } from "@/gql/graphql";

const router = useRouter();
const sheet = ref<HTMLElement | null>(null);

async function cancel() {
  await router.push({ name: "record-projects" });
}

// @ts-expect-error
const project = ref<Event>({
  title: "",
  body: "",
  startsAt: "",
  endsAt: "",
  competences: [],
});

onClickOutside(sheet, async () => {
  await cancel();
});

onKeyStroke("Escape", async () => {
  await cancel();
});
</script>

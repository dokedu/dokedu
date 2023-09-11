<template>
  <PageWrapper>
    <EntryForm :entry="entry" mode="new" @saved="saved" />
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from "@/components/page-wrapper.vue";
import { ref } from "vue";
import EntryForm from "@/components/d-entry/d-entry-form.vue";
import { useRouter } from "vue-router/auto";

const router = useRouter();

const entry = ref({
  date: today(),
  body: "",
  tags: [],
});

// yyyy-mm-dd
function today() {
  return new Date().toISOString().slice(0, 10);
}

function saved(entry: { id: string }) {
  router.push({ name: "/record/entries/[id]", params: { id: entry.id } });
}
</script>

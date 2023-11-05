<template>
  <div id="element" class="flex h-screen max-h-screen w-full flex-col">
    <MPageHeader />
    <template v-if="!fetching && data?.entry">
      <MEntryForm v-model="entryData" />
    </template>
    <div v-else class="flex-1 divide-y divide-neutral-200 overflow-scroll text-sm">
      <div class="h-screen" />
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "layout": "mobile",
    "app": "record"
  }
}
</route>

<script lang="ts" setup>
import MPageHeader from "@/components/mobile/m-page-header.vue";
import MEntryForm from "@/components/mobile/m-entry-form.vue";
import { useRoute } from "vue-router/auto";
import entryByIdQuery from "@/queries/entryById";
import { useQuery } from "@urql/vue";
import { computed } from "vue";

const route = useRoute("/m/record/entries/[id]");

const { data, fetching } = useQuery({
  query: entryByIdQuery,
  variables: {
    id: route.params.id,
  },
});

const entryData = computed(() => {
  return data.value?.entry || {};
});
</script>

<style scoped>
#element {
  max-height: -webkit-fill-available;
  max-height: -moz-available;
  max-height: fill-available;
  max-height: 100dvh;
}
</style>

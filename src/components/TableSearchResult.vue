<template>
  <div v-bind="$attrs" v-if="fetching" v-for="i in variables.limit" :key="i" class="animate-pulse">
    <div v-for="column in columns" :key="column.key" class="border-b border-stone-100 px-8 py-3">
      <div class="h-3 rounded-full bg-stone-100"></div>
    </div>
  </div>
  <div
    v-bind="$attrs"
    v-else
    v-for="row in data[objectName]?.edges"
    :key="row.id"
    class="grid transition-colors hover:bg-stone-50"
  >
    <slot :row="row" :fetching="fetching"></slot>
  </div>
  <slot name="empty" v-if="!fetching && !data[objectName]?.edges && pageVariables.offset === 0" />
</template>

<script lang="ts" setup>
import { useQuery } from "@urql/vue";
import { watch } from "vue";
import { toRef } from "vue";

const props = defineProps(["query", "variables", "objectName", "columns"]);
const pageVariables = toRef(props, "variables");

const { data, fetching } = useQuery({
  query: props.query,
  variables: pageVariables,
});

watch(data, () => {
  if (!data.value) return;
  pageVariables.value.nextPage = data.value[props.objectName]?.pageInfo.hasNextPage;
});
</script>

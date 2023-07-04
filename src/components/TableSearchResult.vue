<template>
  <tr v-if="fetching" v-for="i in variables.limit" :key="i" class="animate-pulse">
    <td v-for="column in columns" :key="column.key" class="border-b border-stone-100 px-8 py-3">
      <div class="h-3 rounded-full bg-stone-100"></div>
    </td>
  </tr>
  <tr v-else v-for="row in data[objectName]?.edges">
    <slot :row="row" :fetching="fetching"></slot>
  </tr>
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

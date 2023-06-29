<template>
  <div>
    <div v-if="error">Error occured</div>
    <div
      v-if="fetching"
      v-for="i in variables.limit"
      :key="i"
      class="flex h-9 min-h-[36px] animate-pulse items-center gap-4 border-b border-stone-100 px-8"
    >
      <div class="h-2.5 w-20 rounded-full bg-stone-200"></div>
      <div class="h-2.5 w-20 rounded-full bg-stone-200"></div>
    </div>
    <div v-if="data && data[objectName]?.edges" v-for="row in data[objectName]?.edges">
      <slot :row="row"></slot>
    </div>
    <slot v-if="data && !data[objectName].edges && !data[objectName].pageInfo.hasPrevPage" name="placeholder"></slot>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from "@urql/vue";
import { watch } from "vue";
import { toRef } from "vue";

const props = defineProps(["query", "variables", "objectName"]);
const pageVariables = toRef(props, "variables");

const { data, fetching, error } = useQuery({
  query: props.query,
  variables: pageVariables,
});

watch(data, () => {
  if (!data.value) return;
  pageVariables.value.nextPage = data.value[props.objectName]?.pageInfo.hasNextPage;
});
</script>

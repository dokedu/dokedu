<template>
  <div class="h-full w-full overflow-scroll" ref="table">
    <table class="w-full border-separate">
      <thead class="sticky top-0 bg-white">
        <th
          v-for="(column, index) in columns"
          class="border-b border-stone-100 px-8 py-2 text-left text-sm"
          :key="index"
          scope="col"
        >
          <slot :name="`${column.key}-header`" :column="column">
            <DButton
              type="outline"
              size="sm"
              v-if="column.sortable"
              :icon-right="
                currentSort.key === column.key
                  ? currentSort.order === column.sortable.asc
                    ? ArrowUp
                    : ArrowDown
                  : ArrowUpDown
              "
              @click="sortBy(column)"
            >
              {{ column.label }}
            </DButton>
            <div v-else>
              {{ column.label }}
            </div>
          </slot>
        </th>
      </thead>
      <tbody>
        <TableSearchResult
          v-for="(vars, i) in pageVariables"
          :key="i"
          :query="query"
          :object-name="objectName"
          :variables="vars"
        >
          <template v-slot="{ row }">
            <td
              class="border-b border-stone-100 px-8 py-2 text-sm"
              v-for="(column, subIndex) in columns"
              :key="subIndex"
              @click="to(row)"
            >
              <slot v-if="row" :name="`${column.key}-data`" :item="row" :column="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
          </template>
        </TableSearchResult>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import TableSearchResult from "../TableSearchResult.vue";
import DButton from "../d-button/d-button.vue";
import { ref, PropType, toRef, watch, computed, Ref } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-vue-next";

type Column = {
  key: string;
  label: string;
  sortable?: { [key: string]: string };
};

const props = defineProps({
  modelValue: {
    type: Array,
    default: null,
  },
  columns: {
    type: Array as PropType<Column[]>,
    required: true,
  },
  query: {
    type: Object,
    required: true,
  },
  variables: {
    type: Array as PropType<{ [key: string]: string | number }[]>,
    required: true,
  },
  objectName: {
    type: String,
    required: true,
  },
  to: {
    type: Function as PropType<<Type extends { id: string }>(row: Type) => void>,
    default: null,
  },
  defaultSort: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "load-more", "update:variables"]);
const pageVariables = computed({
  get() {
    return props.variables;
  },
  set(value) {
    emit("update:variables", value);
  },
});
const table = ref<HTMLElement | null>(null);
const currentSort = ref({
  key: props.defaultSort || "",
  order: pageVariables.value[0].order,
});

useInfiniteScroll(table, () => {
  const lastPage = pageVariables.value[pageVariables.value.length - 1];
  if (!lastPage.nextPage) return;
  pageVariables.value.push({
    ...lastPage,
    offset: (lastPage.offset as number) + 50,
  });
});

watch([currentSort], () => {
  // Take the last pageVariables and update the offset
  const lastPage = pageVariables.value[pageVariables.value.length - 1];
  pageVariables.value = [
    {
      ...lastPage,
      offset: 0,
    },
  ];
});

function sortBy(column: Column) {
  if (!column.sortable) return;
  currentSort.value.key = column.key;

  // Take the last pageVariables and update the order
  const lastPage = pageVariables.value[pageVariables.value.length - 1];
  if (currentSort.value.order === column.sortable?.asc) {
    currentSort.value.order = column.sortable.desc;
    lastPage.order = column.sortable.desc;
  } else {
    currentSort.value.order = column.sortable.asc;
    lastPage.order = column.sortable.asc;
  }

  pageVariables.value = [lastPage];
}
</script>

<template>
  <div class="fe flex min-h-0 w-full flex-col text-sm">
    <div v-if="!hideHeader" class="grid h-10" :style="gridColumns">
      <div
        v-for="(column, index) in columns"
        class="flex h-10 items-center border-b border-stone-100 px-6 text-left text-sm"
        :key="index"
        scope="col"
        :class="column.headerClass"
      >
        <slot :name="`${column.key}-header`" :column="column">
          <DButton
            type="transparent"
            size="sm"
            class="text-subtle"
            v-if="column.sortable"
            :icon-right="
              currentKey === column.key ? (currentSort === column.sortable.asc ? ArrowUp : ArrowDown) : ArrowUpDown
            "
            @click="sortBy(column)"
          >
            {{ $t(column.label) }}
          </DButton>
          <div v-else class="px-2 text-subtle">
            {{ $t(column.label) }}
          </div>
        </slot>
      </div>
    </div>
    <div ref="table" class="h-full w-full overflow-scroll">
      <TableSearchResult
        v-for="(vars, i) in pageVariables"
        :key="i"
        :query="query"
        :object-name="objectName"
        :variables="vars"
        :columns="columns"
        :style="gridColumns"
        :activeRowFunc="activeRowFunc"
      >
        <template v-slot="{ row }">
          <div
            class="border-b border-stone-100 px-8 py-2 text-sm"
            v-for="(column, subIndex) in columns"
            :key="subIndex"
            :class="column.dataClass"
            @click="to ? to(row) : null"
          >
            <slot v-if="row" :name="`${column.key}-data`" :item="row" :column="row[column.key]">
              <div class="truncate">
                {{ row[column.key] }}
              </div>
            </slot>
          </div>
        </template>
      </TableSearchResult>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TableSearchResult from "../TableSearchResult.vue";
import DButton from "../d-button/d-button.vue";
import { ref, toRef, PropType, watch, computed, toRefs } from "vue";
import { useInfiniteScroll, useElementSize } from "@vueuse/core";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-vue-next";

type Column = {
  key: string;
  label: string;
  sortable?: { [key: string]: string };
  headerClass?: string;
  dataClass?: string;
  width?: number;
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
    type: Array as PropType<
      { [key: string]: string | number | null | string[] | { [key: string]: string | number | never[] | null } }[]
    >,
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
  watchers: {
    type: Array,
    default: () => [],
  },
  hideHeader: {
    type: Boolean,
    default: false,
  },
  defaultSort: {
    type: String,
    default: null,
  },
  search: {
    type: String,
    default: null,
  },
  activeRowFunc: {
    type: Function as PropType<<Type extends { id: string }>(row: Type) => boolean>,
    default: null,
  },
});

const table = ref<HTMLElement>();
const columns = toRef(props, "columns");

const { width } = useElementSize(table);

// If column has set explicit relative width, use that, otherwise calculate the width
const gridColumns = computed(() => {
  const totalWidth = width.value;
  const columnsData = columns.value;
  const columnCount = columnsData.length;

  // Find the columns with explicitly set widths
  const explicitWidthColumns = columnsData.filter((column) => column.width);
  const explicitColumnCount = explicitWidthColumns.length;

  // Calculate the remaining width for columns without explicit widths
  const remainingWidth = explicitWidthColumns.reduce((total, column) => {
    if (!column.width) return total;
    return total - totalWidth * column.width;
  }, totalWidth);

  // Calculate the width for columns without explicit widths
  const calculatedWidth = remainingWidth / (columnCount - explicitColumnCount);

  // Build the grid-template-columns property
  let gridTemplateColumns = "";
  columnsData.forEach((column) => {
    const columnWidth = column.width ? `${column.width * totalWidth}px` : `${calculatedWidth}px`;
    gridTemplateColumns += `${columnWidth} `;
  });

  return `grid-template-columns: ${gridTemplateColumns}`;
});

const emit = defineEmits(["update:modelValue", "update:variables"]);

const pageVariables = computed({
  get() {
    return props.variables;
  },
  set(value) {
    emit("update:variables", value);
  },
});

const currentSort = ref(pageVariables.value[0].order);
const currentKey = ref(props.defaultSort || "");
const search = toRef(props, "search");

useInfiniteScroll(
  table,
  () => {
    const lastPage = pageVariables.value[pageVariables.value.length - 1];
    if (!lastPage.nextPage) return;

    pageVariables.value.push({
      limit: lastPage.limit,
      order: lastPage.order,
      search: lastPage.search,
      sortBy: lastPage.sortBy,
      offset: (lastPage.offset as number) + ((lastPage.limit as number) || 50),
    });
  },
  { distance: 500 }
);

function sortBy(column: Column) {
  if (!column.sortable) return;
  currentKey.value = column.key;
  currentSort.value = currentSort.value === column.sortable?.asc ? column.sortable.desc : column.sortable.asc;

  pageVariables.value = [
    {
      ...pageVariables.value[0],
      offset: 0,
      order: currentSort.value,
      search: search.value,
    },
  ];
}

const { watchers } = toRefs(props);

// Scroll to top if sort or search changes
watch(
  [currentSort, currentKey, search, watchers],
  (newValue, oldValue) => {
    if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return;
    table.value?.scrollTo({ top: 0, behavior: "smooth" });
  },
  { flush: "post" }
);
</script>

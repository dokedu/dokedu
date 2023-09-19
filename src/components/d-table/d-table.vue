<template>
  <div class="flex min-h-0 w-full select-none flex-col text-sm">
    <div v-if="!hideHeader" class="grid h-10" :style="gridColumns">
      <div
        v-for="(column, index) in columns"
        class="flex h-10 items-center border-b border-stone-100 px-0 text-left text-sm first:pl-6 last:pr-6"
        :key="index"
        :class="column.headerClass"
      >
        <slot :name="`${column.key}-header`" :column="column">
          <DButton
            type="transparent"
            size="sm"
            class="text-subtle"
            v-if="column.sortable"
            :icon-right="getSortIcon(column)"
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
        :draggable="draggable"
        :additionalTypenames="additionalTypenames"
        :drag-data-type="dragDataType"
      >
        <template v-slot="{ row }">
          <div
            class="flex items-center border-b border-stone-100 px-2 py-2 text-sm first:pl-8 last:pr-8"
            :class="[{ 'bg-blue-100': isSelected(row) }, column.dataClass]"
            v-for="(column, subIndex) in columns"
            :key="subIndex"
            @click="onRowClick(row)"
          >
            <slot v-if="row" :name="`${column.key}-data`" :item="row" :column="row[column.key]">
              <div class="truncate">
                {{ row[column.key] }}
              </div>
            </slot>
          </div>
        </template>
        <template #empty>
          <slot name="empty" />
        </template>
      </TableSearchResult>
    </div>
  </div>
</template>

<script lang="ts" setup generic="T, K extends PageVariables, U">
import TableSearchResult from "./d-table-search-result.vue";
import DButton from "../d-button/d-button.vue";
import { ref, toRef, watch, computed, toRefs } from "vue";
import { useInfiniteScroll, useElementSize } from "@vueuse/core";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-vue-next";
import { onClickOutside, onKeyStroke } from "@vueuse/core";
import type { PageVariables } from "@/types/types.ts";

const tableRows = ref();

onClickOutside(tableRows, () => (selectedRows.value = []));
onKeyStroke("Escape", () => (selectedRows.value = []));

type Column = {
  key: string;
  label: string;
  sortable?: { [key: string]: string };
  headerClass?: string;
  dataClass?: string;
  width?: number;
};

type Props = {
  modelValue?: T | T[];
  columns: Column[];
  query: object;
  variables: K[];
  selected?: T[];
  objectName: string;
  watchers?: U[];
  hideHeader?: boolean;
  defaultSort?: string;
  search?: string;
  additionalTypenames?: string[];
  draggable?: boolean;
  // drag-data-type
  dragDataType?: string;
};

const props = withDefaults(defineProps<Props>(), {
  watchers: () => [],
  hideHeader: false,
  draggable: false,
});

const emit = defineEmits(["update:modelValue", "update:variables", "row-click", "update:selected"]);

const getSortIcon = (column: Column) => {
  return currentKey.value === column.key
    ? currentSort.value === column.sortable?.asc
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;
};

const table = ref<HTMLElement>();
const columns = toRef(props, "columns");
const selectedRows = ref<{ id: string }[]>([]);

const isSelected = (row: { id: string }) => {
  return selectedRows.value.some((selectedRow) => selectedRow.id === row.id);
};

function toggleSelectedRow(row: { id: string }) {
  selectedRows.value = [row];
  // const index = selectedRows.value.findIndex((selectedRow) => selectedRow.id === row.id);
  // if (index > -1) {
  //   selectedRows.value.splice(index, 1);
  // } else {
  //   selectedRows.value.push(row);
  // }
}

const onRowClick = (row: { id: string }) => {
  toggleSelectedRow(row);
  emit("update:modelValue", row);
  emit("row-click", row);
  emit("update:selected", selectedRows.value);
};

const { width } = useElementSize(table);

// If column has set explicit relative width, use that, otherwise calculate the width
const gridColumns = computed(() => {
  const totalWidth = width.value;
  const columnsData = columns.value;
  const columnCount = columnsData.length;

  // Find the columns with explicitly set widths
  const explicitWidthColumns = columnsData.filter((column: Column) => column.width);
  const explicitColumnCount = explicitWidthColumns.length;

  // Calculate the remaining width for columns without explicit widths
  const remainingWidth = explicitWidthColumns.reduce((total: number, column: Column) => {
    if (!column.width) return total;
    return total - totalWidth * column.width;
  }, totalWidth);

  // Calculate the width for columns without explicit widths
  const calculatedWidth = remainingWidth / (columnCount - explicitColumnCount);

  // Build the grid-template-columns property
  let gridTemplateColumns = "";
  columnsData.forEach((column: Column) => {
    const columnWidth = column.width ? `${Math.floor(column.width * totalWidth)}px` : `${calculatedWidth}px`;
    gridTemplateColumns += `${columnWidth} `;
  });

  return `grid-template-columns: ${gridTemplateColumns}`;
});

const pageVariables = computed<K[]>({
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

    const nextPageVariables = {
      limit: lastPage.limit,
      order: lastPage.order,
      search: lastPage.search,
      sortBy: lastPage.sortBy,
      filter: lastPage.filter,
      offset: (lastPage.offset as number) + ((lastPage.limit as number) || 50),
      nextPage: undefined,
    } as K;

    pageVariables.value.push(nextPageVariables);
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

<template>
  <div class="relative" ref="select">
    <div
      class="flex min-w-[120px] items-center justify-between gap-2 rounded-md border border-stone-200 py-1.5 pl-2 pr-1"
      @click="toggleSelect"
    >
      <div class="text-sm">{{ label }}</div>
      <ChevronRight class="h-4 w-4 transition-all ease-in-out" :class="open ? 'rotate-90' : 'rotate-0'" />
    </div>
    <div
      v-if="open"
      ref="container"
      class="absolute top-10 max-h-[200px] w-full overflow-y-auto rounded-md bg-white px-1 pb-2 pt-1 shadow"
    >
      <div class="mb-1 flex w-full items-center gap-1 rounded border border-stone-100 py-0.5 pl-1 text-sm">
        <Search class="h-4 w-4 shrink-0 text-subtle"></Search>
        <input class="w-full focus:!outline-none" v-if="searchable" v-model="search" @input="onSearch" />
      </div>
      <PageSearchResult
        v-for="(variables, i) in vars"
        v-if="query"
        :variables="variables"
        :key="i"
        :query="query"
        :objectName="objectName"
      >
        <template v-slot="{ row }">
          <div class="rounded-md px-1.5 py-1 text-sm text-strong hover:bg-stone-100" @click="onSelect">
            <slot :row="row" />
          </div>
        </template>
      </PageSearchResult>
      <div v-else v-for="option in options">
        <pre>{{ option }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ChevronRight } from "lucide-vue-next";
import { ref, toRef } from "vue";
import { onClickOutside, useInfiniteScroll } from "@vueuse/core";
import PageSearchResult from "../PageSearchResult.vue";
import { Search } from "lucide-vue-next";

const emit = defineEmits(["loadMore", "search", "update:modelValue"]);
const search = ref("");

const props = defineProps({
  label: {
    type: String,
    default: "Label",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Array],
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  query: {
    type: Function,
    default: () => {},
  },
  objectName: {
    type: String,
    default: "",
  },
  pageVariables: {
    type: Object,
    default: () => {},
  },
  searchable: {
    type: Boolean,
    default: false,
  },
});

const open = ref(false);
const select = ref(null);
const container = ref(null);
const vars = toRef(props, "pageVariables");
const model = toRef(props, "modelValue");

onClickOutside(select, () => (open.value = false));
useInfiniteScroll(container, () => {
  emit("loadMore");
});

const toggleSelect = () => {
  open.value = !open.value;
};

const onSearch = () => {
  emit("search", search.value);
};

const onSelect = (row) => {
  if (props.multiple) {
    if (model.value.includes(row.id)) {
      model.value = model.value.filter((id) => id !== row.id);
    } else {
      model.value = [...model.value, row.id];
    }
    return;
  }

  emit("update:modelValue", row.id);
};

// TODO: Support multiple
// TODO: Support search
// TODO: Add infinite scroll? option to query?
</script>

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
      <div
        v-if="search != null"
        class="mb-1 flex w-full items-center gap-1 rounded border border-stone-100 py-0.5 pl-1 text-sm"
      >
        <Search class="h-4 w-4 shrink-0 text-subtle"></Search>
        <input class="w-full focus:!outline-none" v-if="search != null" @input="onSearch" />
      </div>
      <div class="container gap-1 overflow-y-auto text-sm">
        <div v-for="option in options">
          <div @click="onSelect(option)" class="px-1 py-0.5 hover:bg-stone-50">{{ option.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ChevronRight } from "lucide-vue-next";
import { ref, toRef } from "vue";
import { onClickOutside } from "@vueuse/core";
import { Search } from "lucide-vue-next";

const emit = defineEmits(["update:modelValue", "update:search"]);

interface Props {
  label?: string;
  multiple?: boolean;
  modelValue?: string | string[];
  search?: string | null;
  options?: { label: string; value: string }[];
}

const props = withDefaults(defineProps<Props>(), {
  label: "Label",
  multiple: false,
  modelValue: "",
  search: null,
  options: () => [],
});

const open = ref(false);
const select = ref(null);
const container = ref(null);
const model = toRef(props, "modelValue");

onClickOutside(select, () => (open.value = false));

const toggleSelect = () => {
  open.value = !open.value;
};

const onSearch = (event) => {
  emit("update:search", event.target?.value);
};

const onSelect = (option: { label: string; value: string }) => {
  if (props.multiple && Array.isArray(model.value)) {
    if (model.value.includes(option.value)) {
      model.value = model.value.filter((id: string) => id !== option.value);
    } else {
      model.value = [...model.value, option.value];
    }
    return;
  }

  emit("update:modelValue", option.value);
};
</script>

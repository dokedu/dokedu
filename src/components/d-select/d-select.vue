<template>
  <div class="relative" ref="select" v-bind="$attrs" @focusin="open = true">
    <div
      class="flex min-w-[120px] items-center justify-between gap-3 rounded-md border border-stone-200 py-1.5 pl-2 pr-1 focus:!outline-none"
      tabindex="0"
      ref="toggle"
    >
      <div class="text-sm">{{ displayedLabel }}</div>
      <div class="flex items-center gap-1">
        <X class="h-4 w-4 shrink-0" v-if="model && model.length" @mousedown.capture="onClear"></X>
        <ChevronRight class="h-4 w-4 transition-all ease-in-out" :class="open ? 'rotate-90' : 'rotate-0'" />
      </div>
    </div>
    <transition name="slide">
      <div
        v-if="open"
        ref="container"
        class="absolute top-10 z-20 max-h-[200px] w-full min-w-[150px] overflow-hidden rounded-md bg-white px-1 pb-2 pt-1 shadow transition-all duration-200 ease-in-out"
        style="transform-origin: top"
      >
        <div
          v-if="search != null"
          class="sticky mb-1 flex w-full items-center gap-1 rounded border border-stone-100 py-0.5 pl-1 text-sm"
        >
          <Search class="h-4 w-4 shrink-0 text-subtle"></Search>
          <input
            class="w-full focus:!outline-none"
            v-if="search != null"
            @input="onSearch"
            :placeholder="$t('search')"
            tabindex="0"
          />
        </div>
        <div class="flex max-h-[160px] flex-col gap-1 overflow-y-auto text-sm" tabindex="-1">
          <slot></slot>
          <div
            v-for="option in sortedOptions"
            @click="onSelect(option)"
            class="flex items-center justify-between rounded-md px-1.5 py-1"
            :class="option === sortedOptions[focusedOptionIndex as number] ? 'bg-stone-50' : 'bg-white'"
            @mouseover="focusedOptionIndex = sortedOptions.indexOf(option)"
            @focusin="focusedOptionIndex = sortedOptions.indexOf(option)"
          >
            <div>
              {{ option.label }}
            </div>
            <Check class="h-4 w-4" v-if="isSelected(option)"></Check>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ChevronRight } from "lucide-vue-next";
import { ref, toRef, computed, nextTick } from "vue";
import { onClickOutside, onKeyStroke } from "@vueuse/core";
import { Search, X, Check } from "lucide-vue-next";

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
const select = ref();
const container = ref(null);
const model = toRef(props, "modelValue");
const toggle = ref();

const onClose = () => {
  open.value = false;
  focusedOptionIndex.value = null;
  emit("update:search", "");
};

onClickOutside(select, onClose);
onKeyStroke("Escape", onClose);

const onSearch = (event: Event) => {
  emit("update:search", (event.target as HTMLInputElement).value);
};

const onSelect = async (option: { label: string; value: string }) => {
  // Set the focus index on the selected option
  if (props.multiple && Array.isArray(model.value)) {
    if (model.value.includes(option.value)) {
      emit(
        "update:modelValue",
        model.value.filter((id: string) => id !== option.value)
      );
    } else {
      emit("update:modelValue", [...model.value, option.value]);
    }

    await nextTick();
    focusedOptionIndex.value = sortedOptions.value.indexOf(option);
    return;
  }

  emit("update:modelValue", option.value);
  focusedOptionIndex.value = sortedOptions.value.indexOf(option);
  open.value = false;
};

const displayedLabel = computed(() => {
  if (!model.value || !model.value.length) return props.label;

  if (props.multiple && Array.isArray(model.value)) {
    return model.value.length + " selected";
  }

  if (!props.options.length) return "No results";
  const option = props.options.find((option) => option.value === model.value);
  return option?.label;
});

const onClear = () => {
  emit("update:search", "");

  if (props.multiple) {
    emit("update:modelValue", null);
  } else {
    emit("update:modelValue", null);
  }

  toggle.value.blur();
  open.value = false;
};

const isSelected = (option: { label: string; value: string }) => {
  if (props.multiple && Array.isArray(model.value)) {
    return model.value.includes(option.value);
  }

  return model.value === option.value;
};

// Computed to sort selected at top
const sortedOptions = computed(() => {
  if (!props.multiple || !Array.isArray(model.value)) return props.options;

  const selected = props.options.filter((option) => model.value.includes(option.value));
  const unselected = props.options.filter((option) => !model.value.includes(option.value));

  return [...selected, ...unselected];
});

// Keyboard navigation
const focusedOptionIndex = ref<number | null>(null);

onKeyStroke("Enter", async () => {
  if (!open.value) return;
  if (!focusedOptionIndex.value) return;

  onSelect(sortedOptions.value[focusedOptionIndex.value]);
});

onKeyStroke("ArrowDown", () => {
  if (focusedOptionIndex.value === null) {
    focusedOptionIndex.value = 0;
    return;
  }

  if (focusedOptionIndex.value === sortedOptions.value.length - 1) {
    focusedOptionIndex.value = 0;
    return;
  }

  focusedOptionIndex.value++;
});

onKeyStroke("ArrowUp", () => {
  if (focusedOptionIndex.value === null) {
    focusedOptionIndex.value = sortedOptions.value.length - 1;
    console.log(focusedOptionIndex.value);
    return;
  }

  if (focusedOptionIndex.value === 0) {
    focusedOptionIndex.value = sortedOptions.value.length - 1;
    return;
  }

  focusedOptionIndex.value--;
});
</script>

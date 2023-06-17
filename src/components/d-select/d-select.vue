<template>
  <div class="min-w-[200px]">
    <DContextMenu
      :show="contextMenuOpen"
      @close="contextMenuOpen = false"
      :alignment="ContextMenuAlignment.Overlay"
      class="max-h-[150px] w-[200px] overflow-y-auto p-1"
    >
      <div class="flex w-full flex-col items-start rounded-md">
        <div
          @click="selectOption(option)"
          v-for="option in options"
          class="flex w-full cursor-pointer items-center justify-between p-1 hover:bg-stone-100"
        >
          <div class="text-sm">{{ option.label }}</div>
          <Check v-show="optionSelected(option)" class="h-4 w-4"></Check>
        </div>
      </div>
    </DContextMenu>
    <div
      class="flex w-full flex-wrap items-start gap-2 rounded-md border border-stone-200 p-2 hover:bg-stone-50"
      @click="contextMenuOpen = true"
    >
      <div v-if="selectedOptions.length" class="text-sm font-medium text-strong">
        {{ selectedOptions.length + " " + label + (selectedOptions.length > 1 ? "s" : "") + " selected" }}
      </div>
      <div v-else class="text-sm text-subtle">{{ label }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DContextMenu from "@/components/d-context-menu/d-context-menu.vue";
import { ContextMenuAlignment } from "@/components/d-context-menu/d-context-menu.vue";
import { ref } from "vue";
import { Check } from "lucide-vue-next";
import { PropType } from "vue";

type OptionType = {
  value: string;
  label: string;
};

const props = defineProps({
  options: {
    type: Array as PropType<OptionType[]>,
    required: true,
  },
  label: {
    type: String,
    default: "Select",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update"]);

const contextMenuOpen = ref(false);
const selectedOptions = ref<OptionType[]>([]);

function optionSelected(option: OptionType) {
  return selectedOptions.value.some((o) => o.value === option.value);
}
function selectOption(option: OptionType) {
  if (props.multiple) {
    if (optionSelected(option)) {
      selectedOptions.value = selectedOptions.value.filter((o) => o.value !== option.value);
    } else {
      selectedOptions.value = [...selectedOptions.value, option];
    }
  } else {
    selectedOptions.value = [option];
  }
}
</script>

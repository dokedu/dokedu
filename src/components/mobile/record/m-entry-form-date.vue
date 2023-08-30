<template>
  <div class="p-4">
    <div class="mb-2 text-stone-500">Datum</div>
    <input
      v-model="date"
      type="date"
      placeholder="Datum"
      class="flex w-full items-center gap-2 rounded-lg border border-stone-200 px-2 py-1.5 text-sm text-stone-500"
    />
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const date = useVModel(props, "modelValue", emit);
</script>

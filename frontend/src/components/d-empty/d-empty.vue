<template>
  <div class="flex w-full mt-20 items-center justify-center gap-3 px-8 py-3">
    <div
      class="flex rounded-xl border border-subtle select-none flex-col bg-muted p-8 max-w-[450px]"
      :class="center ? 'items-center text-center' : ''"
    >
      <div class="mb-4 w-fit rounded-xl bg-strong p-2.5">
        <component :is="icon"></component>
      </div>
      <div class="mb-1 text-sm font-medium text-strong">{{ title }}</div>
      <div class="text-sm text-subtle">{{ text }}</div>
      <div v-if="slots" class="mt-4 flex gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue"
import type { Icon } from "@/types/types"
import { useSlots } from "vue"

const slots = useSlots()

defineProps({
  icon: {
    type: Object as PropType<Icon>,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  center: {
    type: Boolean,
    default: true
  }
})
</script>

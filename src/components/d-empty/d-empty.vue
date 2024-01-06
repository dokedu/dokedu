<template>
  <div class="flex w-full mt-10 items-center justify-center gap-3 px-8 py-3">
    <div class="flex select-none flex-col items-center justify-center rounded-xl bg-muted p-8 max-w-[450px]">
      <div class="mb-4 w-fit rounded-xl bg-strong p-2.5">
        <component :is="icon"></component>
      </div>
      <div class="mb-1 text-center text-sm font-medium text-strong">{{ title }}</div>
      <div class="text-center text-sm text-subtle">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue"

import type { FunctionalComponent, SVGAttributes } from "vue"

interface SVGProps extends Partial<SVGAttributes> {
  size?: 24 | number
  strokeWidth?: number | string
  absoluteStrokeWidth?: boolean
}
type Icon = FunctionalComponent<SVGProps>

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
  }
})
</script>

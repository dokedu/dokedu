<template>
  <component :is="to ? 'router-link' : 'div'" class="px-1" :to="to">
    <div
      class="rounded-lg text-sm items-center gap-2.5 inline-flex hover:text-strong font-medium text-subtle min-w-max w-full"
      :class="`${active ? 'bg-subtle text-strong border' : 'hover:bg-black/5'} ${modeClasses[mode]}`"
    >
      <slot />
    </div>
  </component>
</template>
<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router/auto"

type Props = {
  to?: RouteLocationRaw
  active?: boolean
  mode: "slim" | "default"
}

const modeClasses = {
  slim: "py-1 px-1",
  default: "py-2 px-2"
}

withDefaults(defineProps<Props>(), {
  mode: "default"
})
</script>

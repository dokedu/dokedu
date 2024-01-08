<template>
  <div
    class="rounded-full flex items-center justify-center font-medium"
    :class="`${inverted ? `bg-white text-strong` : `bg-black/10 text-strong`} ${sizes[size]}`"
  >
    <div v-if="initials">
      {{ initials }}
    </div>
    <div v-else class="text-neutral-400">
      <component :is="icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Icon } from "@/types/types"
type Props = {
  initials?: string
  inverted?: boolean
  icon?: Icon
  size: "sm" | "md" | "lg"
}

withDefaults(defineProps<Props>(), {
  inverted: false,
  size: "md"
})

const sizes = {
  sm: "size-8 text-md",
  md: "size-10 text-md",
  lg: "size-12 text-lg"
}
</script>

<template>
  <div class="h-4 flex items-end gap-0.5">
    <div class="w-1 h-1/3 rounded-md" :class="level >= 1 ? `bg-neutral-800` : `bg-neutral-200`"></div>
    <div class="w-1 h-2/3 rounded-md" :class="level >= 2 ? `bg-neutral-800` : `bg-neutral-200`"></div>
    <div class="w-1 h-full rounded-md" :class="level >= 3 ? `bg-neutral-800` : `bg-neutral-200`"></div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ level: number }>()
</script>

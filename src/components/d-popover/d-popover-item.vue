<template>
  <component :is="to ? 'router-link' : 'div'" class="px-1">
    <div
      class="p-2 rounded-lg items-center gap-2.5 inline-flex hover:bg-strong hover:text-strong font-medium text-default min-w-max w-full"
    >
      <slot />
    </div>
  </component>
</template>
<script setup lang="ts">
type Props = {
  to?: string
}

defineProps<Props>()
</script>

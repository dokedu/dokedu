<template>
  <div
    class="absolute flex z-20 gap-1 bg-neutral-50 rounded-xl shadow border border-neutral-200 flex-col overflow-hidden"
    :class="padding ? 'py-1' : ''"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
type Props = {
  padding?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: true
})
</script>

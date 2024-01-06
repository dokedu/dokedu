<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    class="py-1 px-3 rounded-lg"
    :class="active ? 'bg-default text-strong shadow-md' : 'text-subtle hover:bg-black/5'"
  >
    <slot />
  </component>
</template>
<script setup lang="ts">
defineProps({
  active: {
    type: Boolean,
    default: false
  },
  to: {
    type: String,
    default: null
  }
})
</script>

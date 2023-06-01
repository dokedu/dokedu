<template>
  <div
    class="w-fit select-none rounded-full px-2.5 py-1 text-sm font-medium"
    :class="`bg-${color}-50 text-${color}-700`"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
// colors
// bg-blue-50   text-blue-700
// bg-red-50    text-red-700
// bg-orange-50 text-orange-700
// bg-purple-50 text-purple-700
// bg-green-50  text-green-700

defineProps({
  color: {
    type: String,
    default: "blue",
  },
});
</script>

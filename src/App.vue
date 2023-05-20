<template>
  <component :is="Default">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import Default from "./layout/default.vue"

</script>
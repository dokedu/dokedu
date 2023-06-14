<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import Default from "./layout/default.vue";
import Auth from "./layout/auth.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const layout = computed(() => {
  if (route.meta.layout === "auth") {
    return Auth;
  }

  return Default;
});
</script>

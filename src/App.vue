<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import Default from "./layout/default.vue";
import Auth from "./layout/auth.vue";
import None from "./layout/none.vue";
import { useRoute } from "vue-router/auto";
import { computed } from "vue";

const route = useRoute();

const layout = computed(() => {
  switch (route.meta.layout) {
    case "default":
      return Default;
    case "auth":
      return Auth;
    case "none":
      return None;
    default:
      return Default;
  }
});
</script>

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
import { publicRoutes } from "./router/publicRoutes";

const route = useRoute();

const layout = computed(() => {
  if (route.name === undefined) return None;

  if (publicRoutes.includes(route.name)) {
    return Auth;
  }

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

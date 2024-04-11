<template>
  <template v-if="layout">
    <component :is="layout">
      <RouterView />
    </component>
  </template>
  <template>
    <div>loading...</div>
  </template>
</template>

<script setup lang="ts">
import Default from "./layout/default.vue"
import Auth from "./layout/auth.vue"
import None from "./layout/none.vue"
import Mobile from "./layout/mobile.vue"
import Chat from "./layout/chat.vue"
import { useRoute } from "vue-router/auto"
import { computed } from "vue"
import { publicRoutes } from "./router/publicRoutes"

const route = useRoute()

const layout = computed(() => {
  if (route.name === undefined) return null

  if (publicRoutes.includes(route.name)) {
    return Auth
  }

  switch (route.meta.layout) {
    case "default":
      return Default
    case "auth":
      return Auth
    case "none":
      return None
    case "chat":
      return Chat
    case "mobile":
      return Mobile
    default:
      return Default
  }
})
</script>

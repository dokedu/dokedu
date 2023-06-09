<template>
  <div v-if="width >= 1024" id="page" class="flex">
    <PageSidebar />
    <main class="flex w-full">
      <router-view />
    </main>
  </div>
  <div v-else class="mx-auto py-8 px-2 text-4xl">
    <!-- friendly message that only desktop is supported and mobile support will come soon -->
    <div class="text-center">
      <div class="text-9xl mb-8">📱</div>
      <div class="text-2xl">Mobile support coming soon!</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import PageSidebar from "../components/PageSidebar.vue";
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
</script>
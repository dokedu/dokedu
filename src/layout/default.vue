<template>
  <div id="page" class="flex">
    <PageSidebar />
    <main class="flex w-full">
      <router-view />
    </main>
  </div>
</template>
<script setup lang="ts">
import PageSidebar from "../components/PageSidebar.vue";
</script>

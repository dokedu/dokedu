<template>
  <div id="page" class="flex">
    <PageSidebar />
    <main class="flex w-[calc(100vw-230px)]">
      <router-view />
    </main>
  </div>
</template>
<script setup lang="ts">
import PageSidebar from "../components/PageSidebar.vue";
</script>

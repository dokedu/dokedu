<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="text-gray-950 font-medium">Berichte</div>
      <div class="flex gap-2">
        <button type="button" class="bg-gray-50 text-gray-700 px-6 py-1.5 rounded-md transition-all hover:bg-gray-100 hover:text-gray-800">Jahresberichte erstellen</button>
        <router-link :to="{ name: 'record-entries-new' }" class="bg-black text-white px-6 py-1.5 rounded-md">
          Bericht erstellen
        </router-link>
      </div>
    </PageHeader>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
</script>
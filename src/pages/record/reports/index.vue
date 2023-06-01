<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="font-medium text-gray-950">Reports</div>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-md bg-gray-50 px-6 py-1.5 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-800"
        >
          Prepare annual reports
        </button>
        <router-link :to="{ name: 'record-entries-new' }" class="rounded-md bg-black px-6 py-1.5 text-white">
          Create report
        </router-link>
      </div>
    </PageHeader>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
</script>

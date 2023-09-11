<template>
  <PageWrapper>
    <PageHeader>
      <div class="w-full">
        <div class="flex items-center justify-between">
          <div class="font-medium text-strong">{{ $t("trash") }}</div>
        </div>
      </div>
    </PageHeader>
    <div class="select-none px-8 py-4">
      <p class="text-sm text-stone-700">{{ $t("trash_work_in_progress") }}</p>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
import PageHeader from "@/components/page-header.vue";
import PageWrapper from "@/components/page-wrapper.vue";
</script>

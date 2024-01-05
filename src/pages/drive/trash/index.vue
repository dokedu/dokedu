<template>
  <PageWrapper>
    <PageHeader>
      <div class="w-full">
        <div class="flex items-center justify-between">
          <div class="font-medium text-strong">{{ $t("trash") }}</div>
        </div>
      </div>
    </PageHeader>
    <d-empty
      :icon="Trash"
      :title="$t('trash_work_in_progress_title')"
      :text="$t('trash_work_in_progress_text')"
    ></d-empty>
  </PageWrapper>
</template>

<script lang="ts" setup>
import PageHeader from "@/components/page-header.vue";
import PageWrapper from "@/components/page-wrapper.vue";
import DEmpty from "@/components/d-empty/d-empty.vue";
import { Trash } from "lucide-vue-next";
</script>

<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="font-medium text-stone-950">Reports</div>
      <div class="flex gap-2">
        <d-button type="transparent" :icon-left="Newspaper">Prepare annual reports</d-button>
        <router-link :to="{ name: 'record-entries-new' }">
          <d-button type="primary" :icon-left="Plus">Create</d-button>
        </router-link>
      </div>
    </PageHeader>
  </PageWrapper>
</template>
<script setup lang="ts">
import { Newspaper } from "lucide-vue-next";
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import DButton from "../../../components/d-button/d-button.vue";
import { Plus } from "lucide-vue-next";
</script>

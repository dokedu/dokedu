<template>
  <DDriveFileList title="Shared Drives" :bucket-id="route.params.id" />
</template>

<script setup lang="ts">
import DDriveFileList from "@/components/d-drive/d-drive-file-list.vue";
import { useRoute } from "vue-router/auto";

const route = useRoute("/drive/shared-drives/[id]/");
</script>

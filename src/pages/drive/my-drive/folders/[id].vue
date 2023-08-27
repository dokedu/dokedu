<template>
  <DDriveFileList :title="$t('my_drive')" :folder-id="route.params.id" />
</template>

<script setup lang="ts">
import DDriveFileList from "@/components/d-drive/d-drive-file-list.vue";
import { useRoute } from "vue-router/auto";

const route = useRoute("/drive/my-drive/folders/[id]");
</script>

<template>
  <DDriveFileList :title="$t('shared_drives')" :folder-id="route.params.folderId" :bucket-id="route.params.id" />
</template>

<script setup lang="ts">
import DDriveFileList from "@/components/d-drive/d-file-list.vue"
import { useRoute } from "vue-router/auto"

const route = useRoute("/drive/shared-drives/[id]/folders/[folderId]")
</script>

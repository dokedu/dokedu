<template>
  <div v-i="data && data.file && data.file">
    <DFilePreview :file="data?.file as File" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRoute } from "vue-router/auto";
import DFilePreview from "@/components/_drive/d-file-preview.vue";
import { File } from "@/gql/schema.ts";
import { useFileQuery } from "@/gql/queries/files/file.ts";

const route = useRoute<"/drive/files/[id]">();

const { data } = useFileQuery({
  variables: reactive({
    id: route.params.id as string,
  }),
});
</script>

<template>
  <div v-i="data && data.file && data.file">
    <DFilePreview :file="data?.file as File" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRoute } from "vue-router/auto";
import DFilePreview from "@/components/_drive/d-file-preview.vue";
import { graphql } from "@/gql";
import { useQuery } from "@urql/vue";
import { File } from "@/gql/graphql";

const route = useRoute<"/drive/files/[id]">();

const { data } = useQuery({
  query: graphql(`
    query file($id: ID!) {
      file(id: $id) {
        id
        name
        fileType
        MIMEType
        size
        createdAt
      }
    }
  `),
  variables: reactive({
    id: route.params.id as string,
  }),
});
</script>

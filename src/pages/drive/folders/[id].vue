<template>
  <PageWrapper>
    <PageHeaderDrive @upload="upload" />
    <div class="h-[100%-14rem] max-h-[100%-14rem] overflow-auto">
      <DFileDropZone @upload="upload">
        <DFileList @click="clickFile" />
      </DFileDropZone>
    </div>
  </PageWrapper>
  <DFilePreview :file="previewFile" @close="previewFile = null" />
</template>
<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router/auto";
import { File } from "@/gql/graphql";
import DFileList from "@/components/drive/DFileList.vue";
import DFileDropZone from "@/components/drive/DFileDropZone.vue";
import PageHeaderDrive from "@/components/drive/PageHeaderDrive.vue";
import DFilePreview from "@/components/drive/DFilePreview.vue";

const route = useRoute<"/drive/folders/[id]">();
const router = useRouter();

const folderId = computed(() => {
  return route.params.id;
});

const previewFile = ref<File | null>(null);

// @ts-expect-error
async function upload({ files, parentId = folderId.value }) {
  for (const file of files) {
    await uploadFile({
      input: {
        file: file,
        parentId: parentId as string,
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

const { executeMutation: uploadFile } = useMutation(
  graphql(`
    mutation uploadFile($input: FileUploadInput!) {
      uploadFile(input: $input) {
        id
      }
    }
  `)
);

async function clickFile(file: File) {
  if (file.fileType === "folder") {
    await router.push({
      name: "/drive/my-drive/folders/[id]",
      params: {
        id: file.id,
      },
    });
  } else {
    previewFile.value = file;
  }
}
</script>

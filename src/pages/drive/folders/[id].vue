<template>
  <PageWrapper>
    <PageHeaderDrive @upload="upload" />
    <PageContent>
      <DFileDropZone @upload="upload">
        <DFileList :files="filesSorted" @click="clickFile" />
      </DFileDropZone>
    </PageContent>
  </PageWrapper>
  <DFilePreview :file="previewFile" @close="previewFile = null" />
</template>
<script setup lang="ts">
import PageWrapper from "../../../components/PageWrapper.vue";
import PageContent from "../../../components/PageContent.vue";
import { useMutation, useQuery } from "@urql/vue";
import { graphql } from "../../../gql";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { File } from "../../../gql/graphql";
import DFileList from "./../DFileList.vue";
import DFileDropZone from "./../DFileDropZone.vue";
import PageHeaderDrive from "./../PageHeaderDrive.vue";
import DFilePreview from "./../DFilePreview.vue";

const router = useRouter();
const route = useRoute();

const folderId = computed(() => {
  return route.params.id;
});

const previewFile = ref<File | null>(null);

async function upload({ file, parentId = folderId.value }) {
  console.log(parentId);
  await uploadFile({
    input: {
      file: file,
      parentId: parentId,
    },
  });
  refreshFiles({
    requestPolicy: "network-only",
  });
}

const { executeMutation: uploadFile } = useMutation(
  graphql(`
    mutation singleUpload($input: FileUploadInput!) {
      singleUpload(input: $input) {
        id
      }
    }
  `)
);

const filesSorted = computed(() => {
  if (!files.value?.files.edges) {
    return [];
  }
  // sort by fileType
  return files.value?.files.edges.sort((a, b) => {
    if (a.fileType === "folder" && b.fileType !== "folder") {
      return -1;
    }
    if (a.fileType !== "folder" && b.fileType === "folder") {
      return 1;
    }
    return 0;
  });
});

async function clickFile(file: File) {
  if (file.fileType === "folder") {
    await router.push({
      name: "drive-my-drive-folders-folder",
      params: {
        id: file.id,
      },
    });
  } else {
    previewFile.value = file;
  }
}

const { data: files, executeQuery: refreshFiles } = useQuery({
  query: graphql(`
    query files($input: FilesFilterInput) {
      files(input: $input) {
        edges {
          id
          name
          fileType
          size
        }
      }
    }
  `),
  variables: {
    input: {
      parentId: folderId,
    },
  },
});
</script>

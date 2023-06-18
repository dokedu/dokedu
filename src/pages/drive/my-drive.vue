<template>
  <PageWrapper>
    <PageHeaderDrive @upload="uploadFile" />
    <PageContent>
      <DFileDropZone @upload="upload">
        <DFileList :files="filesSorted" @click="clickFile" />
      </DFileDropZone>
    </PageContent>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageWrapper from "../../components/PageWrapper.vue";
import PageContent from "../../components/PageContent.vue";
import { useMutation, useQuery } from "@urql/vue";
import { graphql } from "../../gql";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { File } from "../../gql/graphql";
import DFileList from "./DFileList.vue";
import DFileDropZone from "./DFileDropZone.vue";
import PageHeaderDrive from "./PageHeaderDrive.vue";

const router = useRouter();

// @ts-expect-error
function upload(file) {
  uploadFile({
    input: {
      file: file,
    },
  });
  refreshFiles();
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
  if (!files.value?.myFiles.edges) {
    return [];
  }
  // sort by fileType
  return files.value?.myFiles.edges.sort((a, b) => {
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
  }
}

const { data: files, executeQuery: refreshFiles } = useQuery({
  query: graphql(`
    query myFiles($input: MyFilesFilterInput) {
      myFiles(input: $input) {
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
    input: {},
  },
});
</script>

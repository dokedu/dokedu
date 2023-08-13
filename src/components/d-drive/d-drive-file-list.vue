<template>
  <PageWrapper>
    <PageHeaderDrive :title="title" @upload="upload" :bucket-id="bucketId" :folder-id="folderId" />
    <div class="h-full overflow-auto">
      <DFileDropZone @upload="upload">
        <DFileList @click="clickFile" :bucket-id="bucketId" :folder-id="folderId" />
      </DFileDropZone>
    </div>
  </PageWrapper>
  <DFilePreview :file="previewFile" @close="previewFile = null" />
</template>

<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { ref, toRefs } from "vue";
import { useRouter } from "vue-router/auto";
import { File } from "@/gql/graphql";
import DFileList from "@/components/drive/DFileList.vue";
import DFileDropZone from "@/components/drive/DFileDropZone.vue";
import PageHeaderDrive from "@/components/drive/PageHeaderDrive.vue";
import DFilePreview from "@/components/drive/DFilePreview.vue";

export interface Props {
  title: string;
  folderId: string | null;
  bucketId: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  bucketId: null,
  folderId: null,
});

const { title, folderId, bucketId } = toRefs(props);

const router = useRouter();

const previewFile = ref<File | null>(null);

async function upload({ files, parentId = folderId.value }: { files: any[]; parentId: string | null }) {
  for (const file of files) {
    await uploadFile({
      input: {
        file,
        parentId,
        ...(props.bucketId ? { bucketId: props.bucketId } : {}),
      },
    });

    // Preventing rate limiting to kick in
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
    const pathName = bucketId.value ? "/drive/shared-drives/[id]/folders/[folderId]" : "/drive/my-drive/folders/[id]";

    const params = {
      id: file.id as string,
    } as { id: string; folderId: string | null | undefined };

    if (bucketId.value) {
      params.id = bucketId.value;
      params.folderId = file.id as string;
    }

    await router.push({
      name: pathName,
      params: params,
    });
  } else {
    previewFile.value = file;
  }
}
</script>

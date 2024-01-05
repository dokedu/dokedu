<template>
  <PageWrapper>
    <PageHeaderDrive :title="title" @upload="upload" :bucket-id="bucketId" :folder-id="folderId"
      :permission="permission" />
    <div class="h-full overflow-auto">
      <DFileDropZone @upload="upload">
        <DFileList @click="clickFile" :bucket-id="bucketId" :folder-id="folderId" />
      </DFileDropZone>
    </div>
  </PageWrapper>
  <DFilePreview :file="previewFile" @close="previewFile = null" />
</template>

<script setup lang="ts">
import PageWrapper from "@/components/page-wrapper.vue"
import { ref, toRefs, type Ref, reactive, computed } from "vue"
import { useRouter } from "vue-router/auto"
import DFileList from "@/components/_drive/d-file-list.vue"
import DFileDropZone from "@/components/_drive/d-file-drop-zone.vue"
import PageHeaderDrive from "@/components/_drive/d-page-header-drive.vue"
import DFilePreview from "@/components/_drive/d-file-preview.vue"
import { useUploadFileMutation } from "@/gql/mutations/files/uploadFile"
import { useBucketByIdSharedQuery } from "@/gql/queries/buckets/bucketByIdShared"
import { FilePermission, type File } from "@/gql/schema"

export interface Props {
  title: string
  folderId: string | null
  bucketId: string | null
}

const props = withDefaults(defineProps<Props>(), {
  bucketId: null,
  folderId: null
})

const { title, folderId, bucketId } = toRefs(props)

const router = useRouter()

const previewFile = ref<File | null>(null)

async function upload({ files, parentId = folderId.value }: { files: any[]; parentId: string | null }) {
  for (const file of files) {
    await uploadFile({
      input: {
        file: file as unknown as any as never,
        parentId,
        ...(props.bucketId ? { bucketId: props.bucketId } : {})
      }
    })

    // Preventing rate limiting to kick in
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

const { executeMutation: uploadFile } = useUploadFileMutation()

async function clickFile(file: File) {
  if (file.fileType === "folder") {
    const pathName = bucketId.value ? "/drive/shared-drives/[id]/folders/[folderId]" : "/drive/my-drive/folders/[id]"

    const params = {
      id: file.id as string
    } as { id: string; folderId: string | null | undefined }

    if (bucketId.value) {
      params.id = bucketId.value
      params.folderId = file.id as string
    }

    await router.push({
      name: pathName,
      params: params
    })
  } else {
    previewFile.value = file
  }
}

const { data: bucket } = useBucketByIdSharedQuery({
  pause: !bucketId.value,
  variables: reactive({
    id: bucketId as Ref<string>
  })
})

// Make computed permission
const permission = computed(() => {
  if (bucket.value?.bucket?.permission) {
    return bucket.value.bucket.permission
  }

  return FilePermission.Manager
})
</script>

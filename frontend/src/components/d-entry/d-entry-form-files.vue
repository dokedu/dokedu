<template>
  <div class="px-8 text-sm select-none">
    <header class="mb-2 flex items-center justify-between">
      <div class="text-neutral-500">{{ $t("file", 2) }}</div>
      <d-button @click="open" size="xs" type="transparent" :icon-left="Upload">
        {{ $t("upload_file") }}
      </d-button>
    </header>
    <div class="mb-2 flex flex-wrap gap-2 w-full">
      <div
        v-for="file in entry.files"
        :key="file.id"
        removable
        @remove="() => deleteFile(file)"
        class="grid p-1 hover:bg-neutral-50 rounded-md gap-2 w-full items-center"
        :style="{
          gridTemplateColumns: '18px 1fr auto auto auto',
          gridTemplateRows: 'auto',
          gridTemplateAreas: '\'icon name size\''
        }"
      >
        <component :is="useFileIcon(file)" :size="18" class="stroke-neutral-700" />
        <div>{{ file.name }}</div>
        <div>{{ prettyBytes(file.size) }}</div>
        <d-icon-button :icon="Download" @click="() => downloadFile(file)" />
        <d-icon-button :icon="Trash" @click="() => deleteFile(file)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Entry } from "@/gql/schema"
import DButton from "../d-button/d-button.vue"
import DIconButton from "../d-icon-button/d-icon-button.vue"
import { useFileDialog } from "@vueuse/core"
import { Upload, Download, Trash } from "lucide-vue-next"
import { toRef } from "vue"
import { useUploadFileToEntryMutation } from "@/gql/mutations/entries/uploadFileToEntry"
import { useRemoveFileFromEntryMutation } from "@/gql/mutations/entries/removeFileFromEntry"
import { useFileIcon, prettyBytes } from "@/composables/useFileHelper"
import useDownloadFile from "@/composables/useDownloadFile"

const props = defineProps<{
  entry: Partial<Entry>
}>()

const entry = toRef(props, "entry")

const { open, reset, onChange } = useFileDialog({
  accept: "*" // Set to accept only image files
})

const { executeMutation: uploadFileToEntry } = useUploadFileToEntryMutation()
const { executeMutation: removeFileFromEntry } = useRemoveFileFromEntryMutation()

onChange((files) => {
  if (!entry.value.id) return
  if (!files) return

  for (const file of files) {
    uploadFileToEntry({
      entryId: entry.value.id as string,
      file: file as unknown as any as never
    })
  }

  reset()
})

async function deleteFile(file: any) {
  await removeFileFromEntry({
    entryId: entry.value.id as string,
    fileId: file.id
  })
}

async function downloadFile(file: any) {
  await useDownloadFile().downloadFile(file)
}
</script>

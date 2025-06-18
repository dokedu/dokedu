<script setup lang="ts">
import { UploadIcon } from "lucide-vue-next"

definePageMeta({
  layout: "settings"
})

const { data: organisation, refresh } = await useFetch("/api/organisation")

const { files, open, reset, onCancel, onChange } = useFileDialog({
  accept: "image/*", // Set to accept only image files
  directory: false // Select directories instead of files if set true
})

async function uploadLogo() {
  open()
}

onChange(async (files) => {
  if (!files || files.length !== 1) return

  const file = files[0]

  const formData = new FormData()
  formData.append("file", file as Blob)

  const { data } = await useFetch("/api/organisation/logo", {
    method: "POST",
    body: formData
  })

  reset()
  await refresh()
})
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Organisation</DHeaderTitle>
    </DHeader>

    <DPageContent>
      <div v-if="organisation" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <DLabel>Name</DLabel>
          <DInput v-model="organisation.name" />
        </div>
        <div>
          <img v-if="organisation.logo" class="size-36 bg-black object-cover" :src="`/api/organisation/logo`" alt="Logo" />
        </div>
        <div>
          <DButton :icon-left="UploadIcon" @click="uploadLogo">Logo hochladen</DButton>
        </div>
      </div>
    </DPageContent>
  </DPage>
</template>

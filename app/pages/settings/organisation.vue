<script setup lang="ts">
import { UploadIcon, SaveIcon } from "lucide-vue-next"

definePageMeta({
  layout: "settings"
})

const { data: organisation, refresh } = await useFetch("/api/organisation")

// Track the original name to detect changes
const originalName = ref(organisation.value?.name || "")
const organisationName = ref(organisation.value?.name || "")
const isSaving = ref(false)

// Computed property to check if there are unsaved changes
const hasChanges = computed(() => {
  return organisationName.value !== originalName.value
})

// Save function to update the organisation name
async function saveOrganisation() {
  isSaving.value = true

  try {
    await $fetch("/api/organisation", {
      method: "PATCH",
      body: {
        name: organisationName.value
      }
    })

    // Update the original name to the new saved value
    originalName.value = organisationName.value

    // Show success message (you can add a toast/notification here if you have one)
    await refresh()
  } catch (error) {
    console.error("Failed to save organisation:", error)
    // Reset to original name on error
    organisationName.value = originalName.value
  } finally {
    isSaving.value = false
  }
}

// Update local state when organisation data changes
watch(
  () => organisation.value?.name,
  (newName) => {
    if (newName) {
      organisationName.value = newName
      originalName.value = newName
    }
  }
)

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
          <DInput v-model="organisationName" />
        </div>
        <div class="flex gap-2">
          <DButton :icon-left="SaveIcon" :disabled="!hasChanges || isSaving" @click="saveOrganisation">
            {{ isSaving ? "Speichern..." : "Speichern" }}
          </DButton>
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

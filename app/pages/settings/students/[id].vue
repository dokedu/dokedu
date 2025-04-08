<script setup lang="ts">
import { useQueryCache } from "@pinia/colada"
import { onKeyDown } from "@vueuse/core"

const queryCache = useQueryCache()

const route = useRoute()

const { data } = await useFetch(`/api/users/${route.params.id}`)

const roleOptions = [
  { value: "owner", display: "Besitzer" },
  { value: "admin", display: "Admin" },
  { value: "teacher", display: "Lehrer" }
]

const container = useTemplateRef<HTMLElement>("container")

onClickOutside(container, () => navigateTo("/settings/students"))
onKeyDown("Escape", () => navigateTo("/settings/students"))

async function onFormSubmit() {
  try {
    await $fetch(`/api/users/${route.params.id}`, {
      method: "PUT",
      body: {
        firstName: data.value?.firstName,
        lastName: data.value?.lastName,
        studentGrade: data.value?.studentGrade,
        studentBirthday: data.value?.studentBirthday
      }
    })
    queryCache.invalidateQueries({ key: ["settings", "students"] })
    navigateTo("/settings/students")
  } catch (error) {
    console.error("Failed to create user:", error)
    // Consider showing a toast notification here to inform the user
  }
}

const showArchiveModal = ref(false)

async function archive() {
  showArchiveModal.value = false
  await $fetch(`/api/users/${route.params.id}`, { method: "DELETE" })
  queryCache.invalidateQueries({ key: ["settings", "students"] })
  await navigateTo("/settings/students")
}

function archiveModal() {
  showArchiveModal.value = true
}
</script>

<template>
  <div ref="container" class="absolute top-0 right-0 h-screen w-[400px] border-l border-neutral-200 bg-white p-4 shadow-lg">
    <form v-if="data" @submit.prevent="onFormSubmit">
      <div class="text-md mb-4 font-medium">Schüler bearbeiten</div>

      <div class="mb-4">
        <d-label for="firstName">Vorname</d-label>
        <d-input id="firstName" class="w-full" v-model="data.firstName" type="text" name="firstName" required />
      </div>
      <div class="mb-4">
        <d-label for="lastName">Nachname</d-label>
        <d-input id="lastName" class="w-full" v-model="data.lastName" type="text" name="lastName" required />
      </div>

      <div class="mb-4">
        <d-label for="studentGrade">Klassenstufe</d-label>
        <d-input id="studentGrade" class="w-full" v-model="data.studentGrade" type="number" name="studentGrade" />
      </div>
      <div class="mb-4">
        <d-label for="studentBirthday">Geburtstag</d-label>
        <d-input id="studentBirthday" class="w-full" v-model="data.studentBirthday" type="date" name="studentBirthday" />
      </div>

      <div class="flex items-center justify-between gap-2">
        <d-button variant="danger-light" @click="archiveModal">Archivieren</d-button>
        <d-button type="submit">Speichern</d-button>
      </div>
    </form>

    <DModal titel="Archivieren" v-if="showArchiveModal" @close="showArchiveModal = false" confirm-text="Archivieren" @confirm="archive">
      <div class="p-4 text-sm text-neutral-500">Möchtest du diesen Benutzer wirklich archivieren?</div>
    </DModal>
  </div>
</template>

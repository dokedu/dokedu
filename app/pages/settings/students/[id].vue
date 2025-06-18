<script setup lang="ts">
import { onKeyDown } from "@vueuse/core"

interface Props {
  refresh: () => Promise<void>
}

const { refresh } = defineProps<Props>()

const route = useRoute()

const { data } = await useFetch(`/api/users/${route.params.id}`)

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
        studentBirthday: data.value?.studentBirthday,
        studentBirthplace: data.value?.studentBirthplace
      }
    })
    await refresh()
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
      <div class="mb-4">
        <d-label for="studentBirthplace">Geburtsort</d-label>
        <d-input id="studentBirthplace" class="w-full" v-model="data.studentBirthplace" type="text" name="studentBirthplace" />
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

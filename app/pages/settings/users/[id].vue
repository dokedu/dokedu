<script setup lang="ts">
import { onKeyDown } from "@vueuse/core"

const route = useRoute()

const { data } = await useFetch(`/api/users/${route.params.id}`)

const firstName = ref(data.value?.firstName)
const lastName = ref(data.value?.lastName)
const email = ref(data.value?.email)
const role = ref(data.value?.role)

const roleOptions = [
  { value: "owner", display: "Besitzer" },
  { value: "admin", display: "Admin" },
  { value: "teacher", display: "Lehrer" }
]

const container = useTemplateRef<HTMLElement>("container")

onClickOutside(container, () => navigateTo("/settings/users"))
onKeyDown("Escape", () => navigateTo("/settings/users"))

async function onFormSubmit() {
  try {
    await $fetch("/api/users", {
      method: "POST",
      body: {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        role: role.value
      }
    })
    navigateTo("/settings/users")
  } catch (error) {
    console.error("Failed to create user:", error)
    // Consider showing a toast notification here to inform the user
  }
}

const showArchiveModal = ref(false)

async function archive() {
  showArchiveModal.value = false
  await $fetch(`/api/users/${route.params.id}`, { method: "DELETE" })
  await navigateTo("/settings/users")
}

function archiveModal() {
  showArchiveModal.value = true
}
</script>

<template>
  <div ref="container" class="absolute top-0 right-0 h-screen w-[400px] border-l border-neutral-200 bg-white p-4 shadow-lg">
    <form @submit.prevent="onFormSubmit">
      <div class="text-md mb-4 font-medium">Benutzer bearbeiten</div>
      <div class="mb-4">
        <d-label for="firstName">Vorname</d-label>
        <d-input id="firstName" class="w-full" v-model="firstName" type="text" name="firstName" required />
      </div>
      <div class="mb-4">
        <d-label for="lastName">Nachname</d-label>
        <d-input id="lastName" class="w-full" v-model="lastName" type="text" name="lastName" required />
      </div>
      <div class="mb-4">
        <d-label for="email">E-Mail</d-label>
        <d-input id="email" class="w-full" v-model="email" type="email" name="email" required disabled />
      </div>
      <div class="mb-4">
        <d-label for="role">Rolle</d-label>
        <d-select v-model="role" :options="roleOptions" name="role" required placeholder="Wähle eine Rolle" disabled />
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

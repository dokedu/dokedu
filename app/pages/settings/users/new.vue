<script setup lang="ts">
import { onKeyDown } from "@vueuse/core"

const firstName = ref("")
const lastName = ref("")
const email = ref("")
const role = ref<any>(null)

const roleOptions = [
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
</script>

<template>
  <div ref="container" class="absolute top-0 right-0 h-screen w-[400px] border-l border-neutral-200 bg-white p-4 shadow-lg">
    <form @submit.prevent="onFormSubmit">
      <div class="text-md mb-4 font-medium">Neuen Benutzer erstellen</div>
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
        <d-input id="email" class="w-full" v-model="email" type="email" name="email" required />
      </div>
      <div class="mb-4">
        <d-label for="role">Rolle</d-label>
        <d-select v-model="role" :options="roleOptions" name="role" required placeholder="Wähle eine Rolle" />
      </div>
      <div class="mb-4">
        <p class="text-xs text-neutral-500">Der Benutzer erhält eine E-Mail mit einem Link, über den er sein Passwort festlegen kann.</p>
      </div>
      <div class="flex items-center justify-end gap-2">
        <d-button type="submit">Erstellen</d-button>
      </div>
    </form>
  </div>
</template>

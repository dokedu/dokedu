<script setup lang="ts">
import { onKeyDown } from "@vueuse/core"

const firstName = ref("")
const lastName = ref("")
const studentGrade = ref("")
const studentBirthday = ref("")

const container = useTemplateRef<HTMLElement>("container")

onClickOutside(container, () => navigateTo("/settings/students"))
onKeyDown("Escape", () => navigateTo("/settings/students"))

async function onFormSubmit() {
  try {
    await $fetch("/api/users", {
      method: "POST",
      body: {
        firstName: firstName.value,
        lastName: lastName.value,
        studentGrade: studentGrade.value,
        studentBirthday: studentBirthday.value,
        role: "student"
      }
    })
    navigateTo("/settings/students")
  } catch (error) {
    console.error("Failed to create user:", error)
    // Consider showing a toast notification here to inform the user
  }
}
</script>

<template>
  <div ref="container" class="absolute top-0 right-0 h-screen w-[400px] border-l border-neutral-200 bg-white p-4 shadow-lg">
    <form @submit.prevent="onFormSubmit">
      <div class="text-md mb-4 font-medium">Neuen Schüler erstellen</div>
      <div class="mb-4">
        <d-label for="firstName">Vorname</d-label>
        <d-input id="firstName" class="w-full" v-model="firstName" type="text" name="firstName" required />
      </div>
      <div class="mb-4">
        <d-label for="lastName">Nachname</d-label>
        <d-input id="lastName" class="w-full" v-model="lastName" type="text" name="lastName" required />
      </div>

      <div class="mb-4">
        <d-label for="studentGrade">Klassenstufe</d-label>
        <d-input id="studentGrade" class="w-full" v-model="studentGrade" type="number" name="studentGrade" />
      </div>
      <div class="mb-4">
        <d-label for="studentBirthday">Geburtstag</d-label>
        <d-input id="studentBirthday" class="w-full" v-model="studentBirthday" type="date" name="studentBirthday" />
      </div>

      <div class="flex items-center justify-end gap-2">
        <d-button type="submit">Erstellen</d-button>
      </div>
    </form>
  </div>
</template>

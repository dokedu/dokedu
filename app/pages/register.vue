<script setup lang="ts">
definePageMeta({
  layout: false
})

const orgName = ref("")
const firstName = ref("")
const lastName = ref("")
const email = ref("")
const password = ref("")
const errorMsg = ref("") // Add error message
const success = ref(false)
const loading = ref(false) // Add loading state

async function register() {
  try {
    loading.value = true // Set loading to true
    errorMsg.value = "" // Reset error message
    success.value = false // Reset success

    await $fetch("/api/register", {
      method: "POST",
      body: {
        organisationName: orgName.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value
      }
    })
    success.value = true
  } catch (e: any) {
    // Catch the error to display to user
    errorMsg.value = e.data?.message || "Ein Fehler ist aufgetreten." // Access error message. Use a generic message if not available
  } finally {
    loading.value = false // Set loading back to false
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-100 px-8 pt-24">
    <div class="mx-auto max-w-sm rounded-lg border border-neutral-50 bg-white p-8 shadow">
      <h1 class="mb-4 text-center text-2xl font-semibold text-neutral-900">Registrieren bei Dokedu</h1>

      <div v-if="success">
        <h2 class="text-center text-lg font-semibold text-green-600">Erfolgreich registriert!</h2>
        <p class="text-center text-sm text-neutral-500">Bitte überprüfe dein E-Mail-Postfach für den Bestätigungslink.</p>
        <p class="mt-4 text-center text-sm text-neutral-500">
          <NuxtLink to="/login" class="hover:underline">Zum Login</NuxtLink>
        </p>
      </div>

      <form v-else @submit.prevent="register" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <d-label for="orgName">Organisation</d-label>
          <d-input v-model="orgName" type="text" id="orgName" name="orgName" required placeholder="Name der Organisation" />
        </div>
        <div class="flex flex-col gap-1">
          <d-label for="firstName">Vorname</d-label>
          <d-input v-model="firstName" type="text" id="firstName" name="firstName" required placeholder="Dein Vorname" />
        </div>
        <div class="flex flex-col gap-1">
          <d-label for="lastName">Nachname</d-label>
          <d-input v-model="lastName" type="text" id="lastName" name="lastName" required placeholder="Dein Nachname" />
        </div>
        <div class="flex flex-col gap-1">
          <d-label for="email">E-Mail</d-label>
          <d-input v-model="email" type="email" id="email" name="email" required placeholder="Deine E-Mail-Adresse" />
        </div>
        <div class="flex flex-col gap-1">
          <d-label for="password">Passwort</d-label>
          <d-input v-model="password" type="password" id="password" name="password" required placeholder="Dein Passwort" />
        </div>
        <d-button :loading="loading" type="submit" class="items-center justify-center bg-black text-white"> Registrieren </d-button>
        <div v-if="errorMsg" class="mb-2 rounded-md bg-red-100 px-4 py-2 text-center text-sm text-red-600">
          {{ errorMsg }}
        </div>
        <p class="text-center text-sm text-neutral-500">Bereits registriert? <NuxtLink to="/login" class="hover:underline">Anmelden</NuxtLink></p>
      </form>
    </div>
  </div>
</template>

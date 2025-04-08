<script setup lang="ts">
definePageMeta({
  layout: false
})

const email = ref("")
const password = ref("")
const errorMsg = ref("")
const loading = ref(false)

const { fetch: refreshSession } = useUserSession()

async function login() {
  try {
    loading.value = true
    errorMsg.value = ""
    await $fetch("/api/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value
      }
    })
    await refreshSession()
    await navigateTo("/entries")
  } catch (e) {
    errorMsg.value = "Ungültige Anmeldedaten"
    loading.value = false
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-100 px-8 pt-24">
    <div class="mx-auto max-w-sm rounded-lg border border-neutral-50 bg-white p-8 shadow">
      <h1 class="mb-4 text-center text-2xl font-semibold text-neutral-900">Anmelden bei Dokedu</h1>

      <form @submit.prevent="login" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <d-label for="email">E-Mail</d-label>
          <d-input v-model="email" type="email" id="email" name="email" required placeholder="Deine E-Mail-Adresse" />
        </div>
        <div class="flex flex-col gap-1">
          <d-label for="password">Passwort</d-label>
          <d-input v-model="password" type="password" id="password" name="password" required placeholder="Dein Passwort" />
        </div>
        <d-button :loading type="submit" class="items-center justify-center bg-black text-white">Anmelden</d-button>
        <div v-if="errorMsg" class="mb-2 rounded-md bg-red-100 px-4 py-2 text-center text-sm text-red-600">
          {{ errorMsg }}
        </div>
        <p class="text-center text-sm text-neutral-500">
          Passwort vergessen? <NuxtLink to="/forgot-password" class="hover:underline">Passwort zurücksetzen</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

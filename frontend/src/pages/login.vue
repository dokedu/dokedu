<template>
  <div class="w-full h-full">
    <header class="w-full p-4">
      <img
        height="71"
        width="401"
        class="h-6 w-fit text-neutral-950 opacity-80"
        src="/wordmark.svg"
        alt="dokedu logo"
      />
    </header>
    <div class="flex justify-center w-full items-center pt-24">
      <form @submit.prevent="onSubmit" class="flex flex-col gap-5 p-4 w-full max-w-[320px]">
        <h1 class="text-2xl font-semibold text-neutral-950">
          Erfasse und verknüpfe, <br />
          <span class="text-neutral-400 font-medium">digital und kollaborativ</span>
        </h1>
        <d-input
          size="md"
          label="E-Mail-Adresse"
          v-model="email"
          type="email"
          name="email"
          id="email"
          required
          autocomplete="email"
          placeholder="E-Mail-Adresse eingeben"
        />
        <d-button submit type="primary">Weiter</d-button>
        <p class="text-sm text-red-600">{{ authError }}</p>
      </form>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "layout": "auth"
  }
}
</route>

<script lang="ts" setup>
import { ref } from "vue"
import DInput from "@/components/d-input/d-input.vue"
import DButton from "@/components/d-button/d-button.vue"
import { useSignInWithOtpMutation } from "@/gql/mutations/auth/signInWithOtp"
import { useSessionStorage } from "@vueuse/core"
import { useRouter } from "vue-router"

const router = useRouter()

const { executeMutation: signIn } = useSignInWithOtpMutation()

const email = useSessionStorage("_auth_email", "")
const authError = ref<Error | null>(null)

async function onSubmit() {
  const { error } = await signIn({
    email: email.value
  })
  if (error) return alert("Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.")
  router.push("/confirm")
}
</script>

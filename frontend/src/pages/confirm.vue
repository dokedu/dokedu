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
        <div>
          <h1 class="text-lg mb-2 font-semibold text-neutral-950">Bestätigungs-Code eingeben</h1>
          <p class="text-sm text-neutral-500">
            Bitte schau in deinen Posteingang und gib den Code ein, den wir dir geschickt haben.
          </p>
        </div>
        <d-input name="code" size="md" label="Code" v-model="token" type="text" placeholder="Code eingeben" />
        <d-button submit type="primary">Anmelden</d-button>
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
import { useVerifyOtpMutation } from "@/gql/mutations/auth/verifyOtp"
import { useSessionStorage } from "@vueuse/core"
import { useAuth } from "@/composables/auth"

const { executeMutation: verifyOtp } = useVerifyOtpMutation()

const { signIn } = useAuth()

const email = useSessionStorage("_auth_email", "")
const token = ref("")
const authError = ref<Error | null>(null)

async function onSubmit() {
  const { data, error } = await verifyOtp({
    input: {
      email: email.value,
      token: token.value
    }
  })
  if (error) return alert("Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.")
  signIn(data?.verifyOtp.token!, data?.verifyOtp.user!)
}
</script>

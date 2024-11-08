<template>
  <div class="w-full h-full pt-[10vh]">
    <form class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm" @submit.prevent="submit">
      <div class="text-2xl font-semibold mb-2">Anmelden bei Dokedu</div>
      <div class="text-sm mb-4 text-gray-500">Wähle deine bevorzugte Anmeldemethode</div>
      <div class="mb-4 grid grid-cols-2 gap-1 p-1 bg-gray-50 rounded-lg">
        <d-button :type="method === 'passwordless' ? 'outline' : 'transparent'" @click="method = 'passwordless'">
          Ohne Passwort
        </d-button>
        <d-button :type="method === 'password' ? 'outline' : 'transparent'" @click="method = 'password'">
          Mit Passwort
        </d-button>
      </div>

      <div v-if="method === 'passwordless'" class="flex flex-col gap-2">
        <template v-if="awaitingCode">
          <label for="code" class="text-sm text-gray-700">Code</label>
          <d-input type="text" v-model="code" name="code" placeholder="Code" />
          <div class="text-sm text-gray-500 mb-2">Bitte gib den Code ein, den du per E-Mail erhalten hast</div>

          <d-button type="primary" class="w-full" submit>Anmelden</d-button>
        </template>
        <template v-else>
          <label for="email" class="text-sm text-gray-700">E-Mail</label>
          <d-input type="email" id="email" v-model="email" required name="email" placeholder="E-Mail" />
          <div v-if="errorMessage" class="text-xs text-red-600 mb-2">{{ errorMessage }}</div>
          <d-button type="primary" class="w-full" submit>Weiter mit E-Mail</d-button>
        </template>
      </div>
      <div v-else class="flex flex-col gap-2">
        <label for="email" class="text-sm text-gray-700">E-Mail</label>
        <d-input type="email" id="email" v-model="email" required name="email" placeholder="E-Mail" />
        <label for="password" class="text-sm text-gray-700">Passwort</label>
        <d-input type="password" id="password" required v-model="password" name="password" placeholder="Passwort" />
        <div v-if="errorMessage" class="text-xs text-red-600 mb-2">{{ errorMessage }}</div>
        <d-button type="primary" class="w-full" submit>Anmelden</d-button>
        <div class="w-full">
          <d-button to="/forgot-password" class="w-full" type="transparent">Passwort vergessen?</d-button>
        </div>
      </div>
    </form>
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
import DButton from "@/components/d-button/d-button.vue"
import DInput from "@/components/d-input/d-input.vue"
import { useSignInWithOtpMutation } from "@/gql/mutations/auth/signInWithOtp"
import { ref } from "vue"
import { useVerifyOtpMutation } from "@/gql/mutations/auth/verifyOtp"
import { useSignInMutation } from "@/gql/mutations/auth/signIn"
import { user, token, enabledApps, language, afterSignInHandleRedirect } from "@/composables/auth"
import { useSessionStorage } from "@vueuse/core"

const awaitingCode = ref(false)
const code = ref("")
const method = useSessionStorage("dokedu-login-method", "passwordless")
const email = ref("")
const password = ref("")
const errorMessage = ref<string>()

const { executeMutation: ignInWithOtp } = useSignInWithOtpMutation()
const { executeMutation: verifyOtp } = useVerifyOtpMutation()
const { executeMutation: signIn } = useSignInMutation()

async function submit() {
  language.value = "de"
  enabledApps.value = ["admin", "record", "school", "drive"]

  errorMessage.value = undefined
  if (method.value === "passwordless") {
    if (!awaitingCode.value) {
      awaitingCode.value = true
      await ignInWithOtp({
        email: email.value
      })
      return
    }
    try {
      const { data, error } = await verifyOtp({
        input: {
          email: email.value,
          token: code.value
        }
      })
      if (error) {
        return (errorMessage.value = "Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.")
      }

      if (data) {
        token.value = data.verifyOtp.token
        user.value = data.verifyOtp.user

        await afterSignInHandleRedirect()
      } else {
        errorMessage.value = "Leider ist ein Fehler aufgetreten. Bitte versuche es erneut."
      }
    } catch (e) {
      return (errorMessage.value = "Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.")
    } finally {
      awaitingCode.value = false
      code.value = ""
    }
  } else {
    try {
      const { data, error } = await signIn({
        email: email.value,
        password: password.value
      })
      if (error) {
        return (errorMessage.value = "Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.")
      }

      if (data) {
        token.value = data.signIn.token
        user.value = data.signIn.user

        await afterSignInHandleRedirect()
      } else {
        errorMessage.value = "Leider ist ein Fehler aufgetreten. Bitte versuche es erneut."
      }
    } catch (e) {
      errorMessage.value = "Leider ist ein Fehler aufgetreten. Bitte versuche es erneut."
    }
  }
}
</script>

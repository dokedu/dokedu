<template>
  <div class="select-none text-sm">
    <form @submit.prevent="onSubmit" class="mx-auto flex max-w-xs flex-col gap-4 py-24 text-strong">
      <div class="flex flex-col">
        <img height="67" width="100" class="mx-auto mb-8 w-2/5" src="/dokedu-logo.svg" alt="dokedu logo" />
        <d-input
          :label="$t('email')"
          v-model="email"
          type="email"
          name="email"
          id="email"
          required
          autocomplete="email"
          :placeholder="$t('your_email')"
        ></d-input>
      </div>
      <div class="flex flex-col">
        <d-input
          :label="$t('password')"
          v-model="password"
          type="password"
          name="password"
          id="password"
          required
          :min="8"
          autocomplete="current-password"
          :placeholder="$t('your_password')"
        ></d-input>
        <div class="mt-1 text-xs text-red-500">
          {{ error?.graphQLErrors[0].message }}
        </div>
      </div>
      <button
        class="block rounded-md bg-neutral-950 px-2.5 py-2.5 text-sm font-medium leading-none text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
        type="submit"
        data-umami-event="login"
      >
        {{ $t("log_in") }}
      </button>
      <router-link
        class="mx-auto block w-fit rounded-md text-center text-xs font-medium leading-none text-muted hover:text-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
        to="/forgot-password"
        data-umami-event="forgot-password"
      >
        {{ $t("forgot_password") }}
      </router-link>
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
import { computed, ref } from "vue"
import { useRouter } from "vue-router/auto"
import i18n from "@/i18n"
import { useWindowSize } from "@vueuse/core"
import { useSignInMutation } from "@/gql/mutations/auth/signIn"
import DInput from "@/components/d-input/d-input.vue"

const router = useRouter()

const email = ref("")
const password = ref("")

const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 900)

const { executeMutation: signIn, error } = useSignInMutation()

async function onSubmit() {
  const { data } = await signIn({
    email: email.value,
    password: password.value
  })

  if (!data?.signIn.token) {
    return
  }

  const { enabled_apps, token, setupComplete, language } = data.signIn

  localStorage.setItem("enabled_apps", JSON.stringify(enabled_apps))
  localStorage.setItem("authorization", token)
  localStorage.setItem("language", language)
  localStorage.setItem("setupComplete", setupComplete.toString())

  // Set the i18n locale to the user's language
  i18n.global.locale.value = language as unknown as any

  if (setupComplete === false) {
    await router.push({ name: "/setup/" })
    return
  }

  // enabled_apps
  if (enabled_apps.includes("record")) {
    if (isMobile.value) {
      await router.push({ name: "/m/record/entries/" })
    } else {
      await router.push({ name: "/record/entries/" })
    }
  } else if (enabled_apps.includes("drive")) {
    await router.push({ name: "/drive/my-drive/" })
    return
  } else {
    await router.push({ name: "/settings/profile" })
    return
  }
}
</script>

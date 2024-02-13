<template>
  <d-auth-container :title="$t('dokedu_welcome')" :subtitle="$t('login_info')">
    <template #banner>
      <d-banner v-if="authError" type="error" :title="$t('invalid_credentials')"></d-banner>
    </template>
    <template #form>
      <form @submit.prevent="onSubmit" class="flex flex-col gap-5">
        <div class="flex flex-col gap-3">
          <d-input
            size="md"
            :label="$t('email')"
            v-model="email"
            type="email"
            name="email"
            id="email"
            required
            autocomplete="email"
            :placeholder="$t('your_email')"
          />
          <d-input
            size="md"
            :label="$t('password')"
            v-model="password"
            type="password"
            name="password"
            id="password"
            required
            :min="8"
            autocomplete="current-password"
            :placeholder="$t('your_password')"
          />
        </div>
        <d-button submit type="primary">
          {{ $t("log_in") }}
        </d-button>
        <router-link
          class="mx-auto block w-fit rounded-md text-center text-xs font-medium leading-none text-muted hover:text-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
          to="/forgot-password"
        >
          {{ $t("forgot_password") }}
        </router-link>
      </form>
    </template>
  </d-auth-container>
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
import DAuthContainer from "@/components/_auth/d-auth-container.vue"
import DBanner from "@/components/d-banner/d-banner.vue"
import { useAuth } from "@/composables/auth"

const { signIn } = useAuth()

const email = ref("")
const password = ref("")
const authError = ref<Error | null>(null)

async function onSubmit() {
  const { error } = await signIn({
    email: email.value,
    password: password.value
  })
  if (error) {
    authError.value = error
  }
}
</script>

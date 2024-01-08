<template>
  <d-auth-container title="Forgot password?" subtitle="Enter your email below to start reset">
    <template #banner>
      <d-banner
        v-if="successBanner"
        type="success"
        :title="$t('success')"
        :subtitle="$t('check_your_email_password_reset')"
      ></d-banner>
      <d-banner v-if="errorBanner" type="error" :title="$t('error')" :subtitle="$t('something_went_wrong')"></d-banner>
    </template>
    <template #form>
      <form @submit.prevent="onSubmit" class="flex flex-col gap-5">
        <div class="flex flex-col">
          <d-input
            size="sm"
            :label="$t('email')"
            v-model="email"
            type="email"
            name="email"
            id="email"
            required
            :placeholder="$t('your_email')"
          ></d-input>
        </div>
        <d-button type="primary" submit>
          {{ $t("send_password_reset") }}
        </d-button>
        <router-link
          class="mx-auto mt-2 block w-fit rounded-md text-center text-xs font-medium leading-none text-muted hover:text-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
          to="/login"
        >
          {{ $t("back_to_login") }}
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
import { useI18n } from "vue-i18n"
import { useForgotPasswordMutation } from "@/gql/mutations/auth/forgotPassword"
import DInput from "@/components/d-input/d-input.vue"
import DButton from "@/components/d-button/d-button.vue"
import DAuthContainer from "@/components/_auth/d-auth-container.vue"
import DBanner from "@/components/d-banner/d-banner.vue"

const { t } = useI18n()

const email = ref("")
const successBanner = ref(false)
const errorBanner = ref(false)

const { executeMutation: forgotPassword } = useForgotPasswordMutation()

async function onSubmit() {
  const { data } = await forgotPassword({
    input: {
      email: email.value
    }
  })

  if (data?.forgotPassword.success) {
    successBanner.value = true
    errorBanner.value = false
    email.value = ""
  } else {
    successBanner.value = false
    errorBanner.value = true
  }
}
</script>

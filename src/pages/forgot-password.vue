<template>
  <div class="select-none text-sm">
    <form @submit.prevent="onSubmit" class="mx-auto flex max-w-xs flex-col gap-2 py-24 text-strong">
      <div class="flex flex-col">
        <img height="67" width="100" class="mx-auto mb-8 w-2/5" src="/dokedu-logo.svg" alt="dokedu logo" />
        <div v-if="successBanner" class="mb-4 rounded-lg bg-green-100 p-2 text-green-800">
          <div>
            <span class="text-green-950">{{ $t("success") }}!</span> {{ $t("check_your_email_password_reset") }}
          </div>
        </div>
        <d-input
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
import { useI18n } from "vue-i18n"
import { useForgotPasswordMutation } from "@/gql/mutations/auth/forgotPassword"
import DInput from "@/components/d-input/d-input.vue"
import DButton from "@/components/d-button/d-button.vue"

const { t } = useI18n()

const email = ref("")
const successBanner = ref(false)

const { executeMutation: forgotPassword } = useForgotPasswordMutation()

async function onSubmit() {
  const { data } = await forgotPassword({
    input: {
      email: email.value
    }
  })

  if (data?.forgotPassword.success) {
    successBanner.value = true
    email.value = ""
  } else {
    alert(t("something_went_wrong"))
  }
}
</script>

<template>
  <div class="select-none text-sm">
    <form @submit.prevent="onSubmit" class="mx-auto flex max-w-xs flex-col gap-2 py-24 text-strong">
      <img height="67" width="100" class="mx-auto mb-4 w-2/5" src="/dokedu-logo.svg" alt="dokedu logo" />
      <d-input
        :label="$t('password')"
        v-model="password"
        type="password"
        name="password"
        id="password"
        required
        :min="8"
        :placeholder="$t('your_new_password')"
      ></d-input>
      <d-input
        :label="$t('confirm_password')"
        v-model="passwordConfirm"
        type="password"
        name="confirm-password"
        id="confirm-password"
        required
        :min="8"
        :placeholder="$t('confirm_your_new_password')"
      ></d-input>
      <d-button type="primary" submit>
        {{ $t("reset_password") }}
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
import { useRoute, useRouter } from "vue-router/auto"
import { useI18n } from "vue-i18n"
import { useResetPasswordMutation } from "@/gql/queries/auth/resetPasswordMutation"
import DInput from "@/components/d-input/d-input.vue"
import DButton from "@/components/d-button/d-button.vue"

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const { executeMutation: passwordReset } = useResetPasswordMutation()

const password = ref("")
const passwordConfirm = ref("")

async function onSubmit() {
  const token = route.hash.slice(1).split("&")[0].split("=")[1]

  if (password.value !== passwordConfirm.value) {
    alert(t("passwords_dont_match"))
    return
  }

  if (!token) {
    alert(t("invalid_token"))
    return
  }

  if (password.value.length < 8) {
    alert(t("password_too_short"))
    return
  }

  const { data } = await passwordReset({
    input: {
      token,
      password: password.value
    }
  })

  if (data?.resetPassword?.success) {
    alert(t("password_reset_successfully"))
    await router.push("/login")
  } else {
    alert(t("something_went_wrong"))
  }
}
</script>

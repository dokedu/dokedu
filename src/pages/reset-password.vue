<template>
  <d-auth-container
    :title="`${$t('welcome')}, ${computedInviteDetails?.firstName} ${computedInviteDetails?.lastName} `"
    :subtitle="$t('reset_password_description')"
  >
    <template #banner>
      <!-- <d-banner v-if="successBanner" type="success" :title="t('password_set_successfully')"></d-banner> -->
      <!-- <d-banner v-if="errorBanner" type="error" :title="errorTitle"></d-banner> -->
    </template>
    <template #form>
      <form @submit.prevent="onSubmit" class="flex flex-col gap-5">
        <d-input
          :label="$t('email')"
          type="email"
          name="email"
          :disabled="true"
          :modelValue="computedInviteDetails?.email"
          :message="$t('your_login_mail')"
        ></d-input>
        <d-input
          size="sm"
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
          size="sm"
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
import { ref, reactive, computed } from "vue"
import { useRoute, useRouter } from "vue-router/auto"
import { useI18n } from "vue-i18n"
import { useResetPasswordMutation } from "@/gql/mutations/auth/resetPasswordMutation"
import { useInviteDetailsQuery } from "@/gql/queries/auth/inviteDetails"
import DInput from "@/components/d-input/d-input.vue"
import DButton from "@/components/d-button/d-button.vue"
import DAuthContainer from "@/components/_auth/d-auth-container.vue"
import DBanner from "@/components/d-banner/d-banner.vue"

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const { executeMutation: passwordReset } = useResetPasswordMutation()

const { data: inviteDetails } = useInviteDetailsQuery({
  variables: reactive({
    token: route.hash.slice(1).split("&")[0].split("=")[1]
  })
})

const computedInviteDetails = computed(() => inviteDetails?.value?.inviteDetails)

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

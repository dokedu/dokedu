<template>
  <page-wrapper>
    <page-header class="select-none justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-neutral-950">Profil</div>
      </div>
    </page-header>
    <div class="flex select-none gap-4 px-8 py-4 text-sm text-subtle">
      <div class="flex w-full max-w-xl flex-col gap-4 rounded-lg bg-neutral-100 p-6">
        <div class="font-medium text-neutral-950">{{ $t("password") }}</div>

        <d-input
          v-model="password"
          name="password"
          :label="$t('your_new_password')"
          type="password"
          :placeholder="$t('your_new_password')"
        />
        <d-input
          v-model="passwordConfirm"
          name="confirm-password"
          :label="$t('confirm_your_new_password')"
          type="password"
          :placeholder="$t('confirm_your_new_password')"
        />

        <d-button size="md" @click="onSave">{{ $t("reset_password") }}</d-button>
      </div>
    </div>
  </page-wrapper>
  <router-view />
</template>

<script lang="ts" setup>
import PageHeader from "@/components/page-header.vue";
import PageWrapper from "@/components/page-wrapper.vue";
import DButton from "@/components/d-button/d-button.vue";
import DInput from "@/components/d-input/d-input.vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useResetPasswordMutation } from "@/gql/queries/auth/resetPasswordMutation.ts";

const { t } = useI18n();

const password = ref("");
const passwordConfirm = ref("");

const { executeMutation: passwordReset } = useResetPasswordMutation();

async function onSave() {
  if (password.value !== passwordConfirm.value) {
    alert(t("passwords_dont_match"));
    return;
  }

  if (password.value.length < 8) {
    alert(t("password_too_short"));
    return;
  }

  const res = await passwordReset({ input: { password: password.value } });
  if (res.error) {
    alert("Error changing password");
    return;
  }

  alert("Password changed successfully");
}
</script>

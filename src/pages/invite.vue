<template>
  <div class="select-none text-sm">
    <form @submit.prevent="onSubmit" class="mx-auto flex max-w-xs flex-col gap-2 py-24 text-strong">
      <div class="flex flex-col gap-4">
        <img height="67" width="100" class="mx-auto mb-4 w-2/5" src="/dokedu-logo.svg" alt="dokedu logo" />
        <div class="flex flex-col">
          <label class="mb-1 text-xs text-neutral-500" for="password">{{ $t("password") }}</label>
          <input
            v-model="password"
            type="password"
            name="password"
            id="password"
            required
            min="8"
            class="block w-full rounded-md border-0 py-2 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-950 sm:text-sm sm:leading-6"
            :placeholder="$t('your_new_password')"
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-1 text-xs text-neutral-500" for="password">{{ $t("confirm_password") }}</label>
          <input
            v-model="passwordConfirm"
            type="password"
            name="confirm-password"
            id="confirm-password"
            required
            min="8"
            class="block w-full rounded-md border-0 py-2 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-950 sm:text-sm sm:leading-6"
            :placeholder="$t('confirm_your_new_password')"
          />
        </div>
      </div>
      <button
        class="block rounded-md bg-neutral-950 px-2.5 py-2.5 text-sm font-medium leading-none text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
        type="submit"
      >
        {{ $t("create_account") }}
      </button>
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
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router/auto";
import { useI18n } from "vue-i18n";
import { useResetPasswordMutation } from "@/gql/queries/auth/resetPasswordMutation.ts";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const { executeMutation: passwordReset } = useResetPasswordMutation();

const password = ref("");
const passwordConfirm = ref("");

async function onSubmit() {
  const token = route.hash.slice(1).split("&")[0].split("=")[1];

  if (password.value !== passwordConfirm.value) {
    alert(t("passwords_dont_match"));
    return;
  }

  if (!token) {
    alert(t("invalid_token"));
    return;
  }

  if (password.value.length < 8) {
    alert(t("password_too_short"));
    return;
  }

  const { data } = await passwordReset({
    input: {
      token,
      password: password.value,
    },
  });

  if (data?.resetPassword?.success) {
    alert(t("password_set_successfuly"));
    await router.push("/login");
  } else {
    alert(t("something_went_wrong"));
  }
}
</script>

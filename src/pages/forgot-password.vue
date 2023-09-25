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
        <label class="mb-1 text-xs text-neutral-500" for="email">{{ $t("email") }}</label>
        <input
          v-model="email"
          type="email"
          name="email"
          id="email"
          required
          class="block w-full rounded-md border-0 py-2 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-950 sm:text-sm sm:leading-6"
          :placeholder="$t('your_email')"
        />
      </div>
      <button
        class="block rounded-md bg-neutral-950 px-2.5 py-2.5 text-sm font-medium leading-none text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
        type="submit"
      >
        {{ $t("send_password_reset") }}
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
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const email = ref("");
const successBanner = ref(false);

const { executeMutation: forgotPassword } = useMutation(
  graphql(`
    mutation forgotPassword($input: ForgotPasswordInput!) {
      forgotPassword(input: $input) {
        success
      }
    }
  `)
);

async function onSubmit() {
  const { data } = await forgotPassword({
    input: {
      email: email.value,
    },
  });

  if (data?.forgotPassword.success) {
    successBanner.value = true;
    email.value = "";
  } else {
    alert(t("something_went_wrong"));
  }
}
</script>

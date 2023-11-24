<template>
  <div class="select-none text-sm">
    <form @submit.prevent="onSubmit" class="mx-auto flex max-w-xs flex-col gap-4 py-24 text-strong">
      <div class="flex flex-col">
        <img height="67" width="100" class="mx-auto mb-8 w-2/5" src="/dokedu-logo.svg" alt="dokedu logo" />
        <label class="mb-1 text-xs text-neutral-500" for="email">{{ $t("email") }}</label>
        <input
          v-model="email"
          type="email"
          name="email"
          id="email"
          required
          autocomplete="email"
          class="block text-sm w-full rounded-md border-0 py-2 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-950 sm:text-sm sm:leading-6"
          :placeholder="$t('your_email')"
        />
      </div>
      <div class="flex flex-col">
        <label class="mb-1 text-xs text-neutral-500" for="password">{{ $t("password") }}</label>
        <input
          v-model="password"
          type="password"
          name="password"
          id="password"
          required
          min="8"
          autocomplete="current-password"
          class="block text-sm w-full rounded-md border-0 py-2 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-950 sm:text-sm sm:leading-6"
          :placeholder="$t('your_password')"
        />

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
import { computed, ref } from "vue";
import signInMutation from "../queries/signIn.mutation";
import { useMutation } from "@urql/vue";
import { useRouter } from "vue-router/auto";
import i18n from "@/i18n.ts";
import { useWindowSize } from "@vueuse/core";

const router = useRouter();

const email = ref("");
const password = ref("");

const { width } = useWindowSize();
const isMobile = computed(() => width.value <= 900);

const { executeMutation: signIn, error } = useMutation(signInMutation);

async function onSubmit() {
  const {
    data: {
      signIn: { token, enabled_apps, language, setupComplete },
    },
  } = await signIn({
    email: email.value,
    password: password.value,
  });

  if (token) {
    localStorage.setItem("enabled_apps", JSON.stringify(enabled_apps));
    localStorage.setItem("authorization", token);
    localStorage.setItem("language", language);
    localStorage.setItem("setupComplete", setupComplete);

    // Set the i18n locale to the user's language
    i18n.global.locale.value = language;

    if (setupComplete === false) {
      await router.push({ name: "/setup/" });
      return;
    }

    // enabled_apps
    if (enabled_apps.includes("record")) {
      if (isMobile.value) {
        await router.push({ name: "/m/record/entries/" });
      } else {
        await router.push({ name: "/record/entries/" });
      }
    } else if (enabled_apps.includes("drive")) {
      await router.push({ name: "/drive/my-drive/" });
      return;
    } else {
      await router.push({ name: "/settings/profile" });
      return;
    }
  }
}
</script>

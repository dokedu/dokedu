<template>
  <header
    class="flex h-screen w-full max-w-[230px] select-none flex-col justify-between border-r border-neutral-100 bg-neutral-50 print:hidden"
  >
    <div class="relative flex flex-col">
      <div class="flex items-center justify-between px-3 py-3 pb-1">
        <app-switcher2 />
      </div>
      <div class="flex flex-col gap-0.5 p-3 pt-2.5">
        <router-link
          v-for="link in app?.links"
          :to="link.route"
          class="flex items-center gap-3 rounded-md px-3 py-1.5 text-neutral-500 transition-all duration-100 hover:bg-neutral-100 hover:text-neutral-950"
          active-class=""
          :class="{ '!bg-neutral-200 text-neutral-900': isLinkActive(link) }"
        >
          <component
            :is="link.icon"
            class="stroke-neutral-500"
            :size="18"
            :class="{ '!stroke-neutral-900': isLinkActive(link) }"
          />
          <div class="text-sm">{{ link.name }}</div>
        </router-link>
      </div>
    </div>
    <div class="px-1 py-4">
      <a
        href="https://dokedu.org/hilfe"
        target="_blank"
        class="flex items-center gap-3 rounded-md p-1 px-3 text-neutral-500 transition-all duration-100 hover:bg-neutral-100 hover:text-neutral-950"
      >
        <HelpCircle class="stroke-neutral-500" :size="18" />
        <div class="text-sm">{{ $t("support") }}</div>
      </a>
      <router-link
        to="/settings/profile"
        class="flex items-center gap-3 rounded-md p-1 px-3 text-neutral-500 transition-all duration-100 hover:bg-neutral-100 hover:text-neutral-950"
      >
        <Settings class="stroke-neutral-500" :size="18" />
        <div class="text-sm">{{ $t("settings") }}</div>
      </router-link>

      <div
        class="flex items-center gap-3 rounded-md p-1 px-3 text-neutral-500 transition-all duration-100 hover:bg-neutral-100 hover:text-neutral-950"
      >
        <globe class="stroke-neutral-500" :size="18" />
        <select
          name="language"
          id="lang"
          class="block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm"
          v-model="language"
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      <div
        class="flex items-center gap-3 rounded-md p-1 px-3 text-neutral-500 transition-all duration-100 hover:bg-neutral-100 hover:text-neutral-950"
        @click="loggingOut"
      >
        <log-out class="stroke-neutral-500" :size="18" />
        <div class="text-sm">{{ $t("log_out") }}</div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Globe, HelpCircle, LogOut, Settings } from "lucide-vue-next";
import { onClickOutside, useStorage } from "@vueuse/core";
import { useRoute } from "vue-router/auto";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { UserLanguage } from "@/gql/graphql";
import { AppLink, apps } from "./d-sidebar/d-sidebar";
import i18n from "@/i18n.ts";
import { useAuth } from "@/composables/auth";
import useActiveApp from "@/composables/useActiveApp";
import AppSwitcher2 from "@/components/AppSwitcher2.vue";

const visibleAppSwitcher = ref<boolean>(false);

const { activeApp } = useActiveApp();

const route = useRoute();

const appSwitcher = ref();

onClickOutside(appSwitcher, () => {
  visibleAppSwitcher.value = false;
});

function isLinkActive(link: AppLink) {
  const name = route.name || "";
  return name.startsWith(link.route);
}

const app = computed(() => apps.value.find((el) => el.id === activeApp.value) || null);

async function loggingOut() {
  await useAuth().signOut();
}

const { executeMutation: updateLanguage } = useMutation(
  graphql(`
    mutation updateUserLanguage($language: UserLanguage!) {
      updateUserLanguage(language: $language) {
        id
        language
      }
    }
  `),
);

function getPreferredLanguage() {
  const languages = navigator.languages;
  const supported = ["en", "de"];

  for (const lang of languages) {
    if (supported.includes(lang)) {
      return lang;
    }
  }

  return "en";
}

// Using the language from the local storage
// If undefined we set it to preferred language
const language = useStorage("language", getPreferredLanguage());

const languageOptions: { [key: string]: UserLanguage } = {
  de: UserLanguage.De,
  en: UserLanguage.En,
};

watch(language, async () => {
  i18n.global.locale.value = language.value as "en" | "de";

  // Update the language in the backend
  await updateLanguage({ language: languageOptions[language.value] });
});
</script>

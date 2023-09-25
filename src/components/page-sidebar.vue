<template>
  <header
    class="flex h-screen w-full max-w-[230px] select-none flex-col justify-between border-r border-stone-100 bg-stone-50 print:hidden"
  >
    <div class="relative flex flex-col">
      <div class="flex items-center justify-between px-3 py-3 pb-1">
        <div
          class="group flex flex-1 justify-between rounded-md p-1 transition-colors hover:bg-strong"
          @click="visibleAppSwitcher = true"
        >
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-stone-200 p-1.5">
              <component v-if="app" :is="app.icon" class="fill-stone-500 stroke-stone-500" :size="16" />
            </div>
            <div class="text-sm text-stone-700 transition-all duration-100 hover:text-stone-950">
              {{ app?.name }} <span v-if="app?.beta" class="text-xs font-medium uppercase text-blue-700">Beta</span>
            </div>
          </div>
          <div class="rounded-md p-1.5 transition-all hover:bg-stone-300">
            <grip :size="16" class="stroke-stone-700" />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-0.5 p-3 pt-2.5">
        <router-link
          v-for="link in app?.links"
          :to="link.route"
          class="flex items-center gap-3 rounded-md px-3 py-1.5 text-stone-500 transition-all duration-100 hover:bg-stone-100 hover:text-stone-950"
          active-class=""
          :class="{ '!bg-stone-200 text-stone-900': isLinkActive(link) }"
        >
          <component
            :is="link.icon"
            class="stroke-stone-500"
            :size="18"
            :class="{ '!stroke-stone-900': isLinkActive(link) }"
          />
          <div class="text-sm">{{ link.name }}</div>
        </router-link>
      </div>
      <div ref="appSwitcher" v-show="visibleAppSwitcher" class="absolute w-full p-1">
        <div class="flex w-full flex-col gap-1 rounded-lg bg-white p-1 shadow-md">
          <div
            v-for="_app in enabledApps"
            class="flex items-center gap-3 rounded-lg border border-white p-2 text-sm hover:bg-stone-100"
            :class="activeApp === _app.id ? `!border-stone-200 bg-stone-100 hover:!bg-stone-100` : ''"
            @click="switchApp(_app.id)"
          >
            <component :is="_app.icon" class="fill-stone-500 stroke-stone-500" :size="20" />
            <span class="text-stone-500" :class="activeApp === _app.id ? `!text-stone-900` : ''">{{ _app.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="px-1 py-4">
      <a
        href="https://dokedu.org/hilfe"
        target="_blank"
        class="flex items-center gap-3 rounded-md p-1 px-3 text-stone-500 transition-all duration-100 hover:bg-stone-100 hover:text-stone-950"
      >
        <HelpCircle class="stroke-stone-500" :size="18" />
        <div class="text-sm">{{ $t("support") }}</div>
      </a>
      <router-link
        to="/settings/profile"
        class="flex items-center gap-3 rounded-md p-1 px-3 text-stone-500 transition-all duration-100 hover:bg-stone-100 hover:text-stone-950"
      >
        <Settings class="stroke-stone-500" :size="18" />
        <div class="text-sm">{{ $t("settings") }}</div>
      </router-link>

      <div
        class="flex items-center gap-3 rounded-md p-1 px-3 text-stone-500 transition-all duration-100 hover:bg-stone-100 hover:text-stone-950"
      >
        <globe class="stroke-stone-500" :size="18" />
        <select
          name="language"
          id="lang"
          class="block w-full rounded-lg border border-stone-200 bg-stone-50 px-2 py-1 text-sm"
          v-model="language"
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      <div
        class="flex items-center gap-3 rounded-md p-1 px-3 text-stone-500 transition-all duration-100 hover:bg-stone-100 hover:text-stone-950"
        @click="loggingOut"
      >
        <log-out class="stroke-stone-500" :size="18" />
        <div class="text-sm">{{ $t("log_out") }}</div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { LogOut, Globe, Grip, Settings, HelpCircle } from "lucide-vue-next";
import { onClickOutside, useStorage } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router/auto";
import { useMutation, useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import { UserLanguage } from "@/gql/graphql";
import { AppLink, apps, UserRole } from "./d-sidebar/d-sidebar";
import i18n from "@/i18n.ts";
import { useAuth } from "@/composables/auth";
import useActiveApp from "@/composables/useActiveApp";
import me from "@/queries/me";

const visibleAppSwitcher = ref<boolean>(false);
const { activeApp } = useActiveApp();

const route = useRoute();
const router = useRouter();

const { data: userData } = useQuery({
  query: me,
});

const appSwitcher = ref();

onClickOutside(appSwitcher, () => {
  visibleAppSwitcher.value = false;
});

function isLinkActive(link: AppLink) {
  const name = route.name || "";
  return name.startsWith(link.route);
}

const enabledAppList = useStorage<string[]>("enabled_apps", []);

const app = computed(() => apps.value.find((el) => el.id === activeApp.value) || null);

const enabledApps = computed(() => {
  const enabled = apps.value.filter((el: { id: string }) => enabledAppList.value.includes(el.id));
  const role = userData.value?.me?.role;
  return enabled.filter((el: { allowedUserRoles: UserRole[] }) => el.allowedUserRoles.includes(role as UserRole));
});

function switchApp(appId: string | null = null) {
  if (appId) {
    activeApp.value = appId;
    visibleAppSwitcher.value = false;

    // Reroute to first link of app
    const app = apps.value.find((el) => el.id === appId);
    if (app) {
      router.push({ name: app.links[0].route });
    }
    return;
  }
  // start at first app of index is out of bounds
  const nextIndex = (enabledApps.value.findIndex((el) => el.id === activeApp.value) + 1) % enabledApps.value.length;
  activeApp.value = enabledApps.value[nextIndex].id;
}

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
  `)
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

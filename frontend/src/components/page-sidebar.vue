<template>
  <header
    class="flex h-screen w-full max-w-[230px] select-none flex-col justify-between border-r border-neutral-100 bg-neutral-50 print:hidden"
  >
    <div class="relative flex flex-col">
      <div class="flex items-center justify-between px-2 py-3 pb-1">
        <app-switcher2 />
      </div>
      <div class="flex flex-col gap-0.5 p-2 pt-2.5">
        <d-sidebar-link
          v-for="(link, _) in app?.links"
          :key="_"
          :to="link.route"
          :active="isLinkActive(link)"
          :icon="link.icon"
        >
          {{ link.name }}
        </d-sidebar-link>
      </div>
    </div>
    <div class="px-2 py-4">
      <d-sidebar-link href="https://dokedu.org/hilfe" :icon="HelpCircle">
        {{ $t("support") }}
      </d-sidebar-link>
      <d-sidebar-link to="/settings/profile" :icon="Settings">
        {{ $t("settings") }}
      </d-sidebar-link>
      <d-sidebar-link :icon="Globe">
        <select
          name="language"
          id="lang"
          class="block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm flex-1"
          v-model="language"
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </d-sidebar-link>
      <d-sidebar-link @click="loggingOut" :icon="LogOut">
        {{ $t("log_out") }}
      </d-sidebar-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { Globe, HelpCircle, LogOut, Settings } from "lucide-vue-next"
import { onClickOutside, useStorage } from "@vueuse/core"
import { useRoute } from "vue-router/auto"
import { type AppLink, apps } from "./d-sidebar/d-sidebar"
import i18n from "@/i18n"
import { useAuth } from "@/composables/auth"
import useActiveApp from "@/composables/useActiveApp"
import AppSwitcher2 from "@/components/AppSwitcher2.vue"
import DSidebarLink from "@/components/d-sidebar/d-sidebar-link.vue"
import { useUpdateUserLanguageMutation } from "@/gql/mutations/general/updateUserLanguage"
import { UserLanguage } from "@/gql/schema"

const visibleAppSwitcher = ref<boolean>(false)

const { activeApp } = useActiveApp()

const route = useRoute()

const appSwitcher = ref()

onClickOutside(appSwitcher, () => {
  visibleAppSwitcher.value = false
})

function isLinkActive(link: AppLink) {
  const name = route.name || ""
  return name.startsWith(link.route)
}

const app = computed(() => apps.value.find((el) => el.id === activeApp.value) || null)

async function loggingOut() {
  await useAuth().signOut()
}

const { executeMutation: updateLanguage } = useUpdateUserLanguageMutation()

function getPreferredLanguage() {
  const languages = navigator.languages
  const supported = ["en", "de"]

  for (const lang of languages) {
    if (supported.includes(lang)) {
      return lang
    }
  }

  return "en"
}

// Using the language from the local storage
// If undefined we set it to preferred language
const language = useStorage("language", getPreferredLanguage())

const languageOptions: { [key: string]: UserLanguage } = {
  de: UserLanguage.De,
  en: UserLanguage.En
}

watch(language, async () => {
  i18n.global.locale.value = language.value as "en" | "de"

  // Update the language in the backend
  await updateLanguage({ language: languageOptions[language.value] })
})
</script>

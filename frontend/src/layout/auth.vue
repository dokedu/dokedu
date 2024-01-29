<template>
  <div class="px-4 bg-subtle h-dvh">
    <div class="flex justify-center w-full py-24">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import i18n from "@/i18n"
import { useLocalStorage } from "@vueuse/core"

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

// Get language from localStorage if set
const language = useLocalStorage("language", getPreferredLanguage())
i18n.global.locale.value = language.value as "en" | "de"
</script>

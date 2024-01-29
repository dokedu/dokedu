import { en } from "@/lang/en"
import { de } from "@/lang/de"
import { createI18n } from "vue-i18n"

function getBrowserLocale() {
  const lang = navigator.language || navigator.userLanguage || "en"
  return lang.split("-")[0]
}

export default createI18n({
  locale: localStorage.getItem("language") || getBrowserLocale(),
  fallbackLocale: "en",
  messages: {
    en,
    de
  },
  legacy: false
})

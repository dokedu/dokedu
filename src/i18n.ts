import { en } from "@/lang/en.ts";
import { de } from "@/lang/de.ts";
import { createI18n } from "vue-i18n";

export default createI18n({
  locale: localStorage.getItem("language") || "en",
  fallbackLocale: "en",
  messages: {
    en,
    de,
  },
  legacy: false,
});

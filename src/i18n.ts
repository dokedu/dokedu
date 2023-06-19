import { en } from './locales/en';
import { de } from './locales/de';
import { createI18n } from 'vue-i18n';

export default createI18n({
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    de,
  },
  legacy: false,
});

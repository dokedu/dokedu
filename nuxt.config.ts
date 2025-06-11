import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-04-11",
  future: { compatibilityVersion: 4 },
  vite: { plugins: [tailwindcss()] },
  ssr: false,
  devtools: { enabled: false },
  css: ["@/app.css"],

  modules: ["nuxt-auth-utils", "@nuxt/fonts", "@vueuse/nuxt"],

  fonts: {
    experimental: { disableLocalFallbacks: true },
    providers: {}
  },

  runtimeConfig: {
    s3AccessKeyId: "",
    s3SecretAccessKey: "",
    s3Endpoint: "",
    s3Bucket: "",
    s3Region: "",

    postmarkServerToken: ""
  },

  nitro: {
    experimental: {
      // websocket: true,
      tasks: true
      //database: true,
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "de"
      },
      title: "Dokedu"
    }
  }
})

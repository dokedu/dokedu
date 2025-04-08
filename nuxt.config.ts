import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-04-08",
  future: { compatibilityVersion: 4 },
  vite: { plugins: [tailwindcss()] },
  ssr: false,
  devtools: { enabled: false },
  css: ["@/app.css"],

  modules: ["nuxt-auth-utils", "@nuxt/fonts", "@vueuse/nuxt", "@pinia/nuxt"],

  fonts: { experimental: { processCSSVariables: true } },

  runtimeConfig: {
    s3AccessKeyId: "",
    s3SecretAccessKey: "",
    s3Endpoint: "",
    s3Bucket: "",
    s3Region: "",

    postmarkServerToken: ""
  },

  nitro: {
    preset: "bun",
    experimental: {
      // websocket: true,
      tasks: true
      //database: true,
    }
  },
  app: {
    head: {
      title: "Dokedu"
    }
  }
})

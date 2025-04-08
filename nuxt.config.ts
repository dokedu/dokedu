import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-04-03",
  future: { compatibilityVersion: 4 },
  vite: { plugins: [tailwindcss()] },
  ssr: false,
  devtools: { enabled: false },
  css: ["@/app.css"],

  modules: ["nuxt-auth-utils", "@nuxt/fonts", "@vueuse/nuxt", "@pinia/nuxt", "@vite-pwa/nuxt"],

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
    // prerender: {
    //   routes: ["/", "/offline"]
    // },
    experimental: {
      // websocket: true,
      tasks: true
      //database: true,
    }
  },
  app: {
    head: {
      title: "Dokedu"
      // link: [{ rel: "manifest", href: "/manifest.webmanifest" }]
    }
  },
  pwa: {
    selfDestroying: true,
    injectRegister: "auto",
    registerType: "autoUpdate",
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      navigateFallback: "/offline"
    },
    manifest: {
      name: "Dokedu",
      short_name: "Dokedu",
      description: "Dokedu Offline App",
      theme_color: "#ffffff",
      icons: [
        {
          src: "pwa-64x64.png",
          sizes: "64x64",
          type: "image/png"
        },
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        }
      ]
    }
  }
})

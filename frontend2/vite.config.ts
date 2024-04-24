import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueRouter from 'unplugin-vue-router/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vueRouter(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*']
      },
      includeAssets: [
        "**/*",
      ],
      manifest: {
        "theme_color": "#f69435",
        "background_color": "#f69435",
        "display": "standalone",
        "scope": "/",
        "start_url": "/",
        "short_name": "vite test",
        "description": "testing vite pwa",
        "name": "vite test",
        "icons": [
          {
            "src": "/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/icon-256x256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
          },
          {
            "src": "/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ],
      },
    }),
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

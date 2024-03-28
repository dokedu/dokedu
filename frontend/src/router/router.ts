import { createRouter, createWebHistory } from "vue-router/auto"
import { publicRoutes } from "./publicRoutes"
import useActiveApp from "@/composables/useActiveApp"
import type { RouteRecordName } from "vue-router/auto"
import { useStorage, useWindowSize } from "@vueuse/core"
import { computed, nextTick } from "vue"

const router = createRouter({
  history: createWebHistory()
})

const { autoUpdateApp } = useActiveApp()
const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 900)
const lastOpenedPage = useStorage("lastOpenedPage", "")
const enabledApps = useStorage<string[]>("enabled_apps", [])

router.beforeEach(async (to) => {
  const token = localStorage.getItem("authorization")
  const loggedIn = token && token !== "null" && token !== "undefined"
  const outsideAllowedRoutes = !publicRoutes.includes(to.path as RouteRecordName)

  if (loggedIn) {
    if (to.path === "/") {
      // redirect to mobile app if enabled
      if (isMobile.value) {
        if (enabledApps.value.includes("drive")) {
          return { name: "/m/record/entries/" }
        } else {
          return { name: "/settings/profile" }
        }
      }
      // redirect to last opened page
      if (lastOpenedPage.value) {
        return lastOpenedPage.value
      } else {
        return { name: "/settings/profile" }
      }
    }
  } else {
    if (outsideAllowedRoutes) {
      return { name: "/login" }
    }
  }
})

router.afterEach((to) => {
  autoUpdateApp(to)

  // Save last opened page
  lastOpenedPage.value = to.path as string
})

export default router

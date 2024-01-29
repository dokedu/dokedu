import { apps } from "@/components/d-sidebar/d-sidebar"
import { useStorage } from "@vueuse/core"
import type { RouteLocationNormalized } from "vue-router/auto"

const activeApp = useStorage("active_app", "")

function autoUpdateApp(route: RouteLocationNormalized) {
  if (!route.name) return

  const c = route.path.split("/")
  const appNames = apps.value.map((a) => a.id)
  if (c[1]) {
    if (appNames.includes(c[1])) {
      activeApp.value = c[1]
    }
  }
}

export default function useActiveApp() {
  return { activeApp, autoUpdateApp }
}

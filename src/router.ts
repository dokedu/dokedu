import { createRouter, createWebHistory } from "vue-router/auto";
import { publicRoutes } from "./router/publicRoutes";
import useActiveApp from "@/composables/useActiveApp";
import { RouteRecordName } from "vue-router/auto";
import { useStorage, useWindowSize } from "@vueuse/core";
import { computed } from "vue";

const router = createRouter({
  history: createWebHistory(),
});

const { autoUpdateApp } = useActiveApp()
const { width } = useWindowSize();
const isMobile = computed(() => width.value <= 900);
const lastOpenedPage = useStorage("lastOpenedPage", "");

router.beforeEach(async (to) => {
  const token = localStorage.getItem("authorization");
  const loggedIn = token && token !== "null" && token !== "undefined";
  const outsideAllowedRoutes = !publicRoutes.includes(to.name as RouteRecordName);

  // If user is logged in and setup is not complete, always redirect to setup
  if (loggedIn) {
    const setupComplete = localStorage.getItem("setupComplete");
    const setupIncomplete = setupComplete === "false";
    if (setupIncomplete && to.name !== "/setup/") {
      return { name: "/setup/" };
    }

    if (to.path === "/") {
      if (isMobile.value) {
        // redirect to mobile app
        return { name: "/m/record/entries/" };
      }
      // redirect to last opened page 
      if (lastOpenedPage.value) {
        return { name: lastOpenedPage.value };
      } else {
        return { name: "/settings/profile" };
      }
    }
  } else {
    // Redirect to login if user is not logged in and is accessing a page outside of allowed routes
    if (outsideAllowedRoutes) {
      return { name: "/login" };
    }
  }
});

router.afterEach((to) => {
  autoUpdateApp(to)

  // Save last opened page
  lastOpenedPage.value = to.name as string
})


export default router;

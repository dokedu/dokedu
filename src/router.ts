import { createRouter, createWebHistory } from "vue-router/auto";

const router = createRouter({
  history: createWebHistory(),
});

const allowedRoutes = ["/login", "/forgot-password", "/reset-password", "/invite"];

router.beforeEach(async (to) => {
  const token = localStorage.getItem("authorization");
  const loggedIn = token && token !== "null" && token !== "undefined";
  const outsideAllowedRoutes = !allowedRoutes.includes(to.name as string);

  // Redirect to login if user is not logged in and is accessing a page outside of allowed routes
  if (outsideAllowedRoutes && !loggedIn) {
    return { name: "/login" };
  }

  // If user is logged in and setup is not complete, always redirect to setup
  if (loggedIn) {
    const setupComplete = localStorage.getItem("setupComplete");
    const setupIncomplete = !setupComplete || setupComplete === "false";
    if (setupIncomplete && to.name !== "/setup/") {
      return { name: "/setup/" };
    }
  }
});


export default router;

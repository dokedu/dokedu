import posthog from "posthog-js";

function newClient() {
  if (import.meta.env.DEV) return null;

  return posthog.init(
    "phc_vuJEeI0467xNeCUJ3Kp514ASOEpWIOAoEsovCukHIg",
    {
      api_host: "https://phog.dokedu.org",
    }
  )
}

export const $posthog = newClient();

export default {
  install(app) {
    app.config.globalProperties.$posthog = $posthog
  }
};

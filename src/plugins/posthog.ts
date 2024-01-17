//./plugins/posthog.js
import posthog from "posthog-js";

export default {
  install(app) {
    app.config.globalProperties.$posthog = posthog.init(
      import.meta.env.PH_PROJECT_API_KEY,
      {
        api_host: import.meta.env.PH_INSTANCE_ADDRESS,
      }
    );
  },
};

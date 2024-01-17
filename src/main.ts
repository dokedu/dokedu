import { createApp } from "vue"
import "./assets/css/style.css"
import App from "./App.vue"
import router from "./router/router"
import makeClient from "./urql/client"
import urql from "@urql/vue"
import i18n from "./i18n"
import "emoji-mart-vue-fast/css/emoji-mart.css"
import posthogPlugin from "./plugins/posthog";

const app = createApp(App)

export const urqlClient = makeClient()

app.use(posthogPlugin);
app.use(router)
app.use(urql, urqlClient)
app.use(i18n)

app.mount("#app")

urqlClient.mutation

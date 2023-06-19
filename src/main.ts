import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router.ts";
import makeClient from "./client.ts";
import urql from "@urql/vue";
import i18n from './i18n.ts'

const app = createApp(App);

app.use(router);
app.use(urql, makeClient())
app.use(i18n)

app.mount("#app");
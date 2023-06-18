import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router.ts";
import makeClient from "./client.ts";
import urql from "@urql/vue";

const app = createApp(App);

app.use(router);
app.use(urql, makeClient())

app.mount("#app");
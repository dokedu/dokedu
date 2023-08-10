import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import makeClient from "./client";
import urql from "@urql/vue";
import i18n from "./i18n";

const app = createApp(App);

export const urqlClient = makeClient();

app.use(router);
app.use(urql, urqlClient);
app.use(i18n);

app.mount("#app");

urqlClient.mutation;

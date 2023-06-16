import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router.ts";
import client from "./client.ts";
import urql from "@urql/vue";

const app = createApp(App);

app.use(router);
app.use(urql, client)

app.mount("#app");

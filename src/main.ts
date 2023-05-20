import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router.ts"
import urql, { cacheExchange, fetchExchange } from '@urql/vue';

const app = createApp(App)

const url = 'http://localhost:8080/query'
function getToken(): string|null {
    return localStorage.getItem("authorization")
}

app.use(router)
app.use(urql, {
    url,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => {
        const token = getToken();
        if (token) {
            return {
                headers: { authorization: token },
            };
        }
    },
});

app.mount('#app')



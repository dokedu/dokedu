import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import urql, { fetchExchange } from '@urql/vue';
import { authExchange } from "@urql/exchange-auth"
import { authToken } from './utils/authToken';
import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';

const storage = makeDefaultStorage({
    idbName: 'graphcache-v3', // The name of the IndexedDB database
    maxAge: 14, // The maximum age of the persisted data in days
});

import schema from '../schema.json'

const app = createApp(App)

const cache = offlineExchange({
    schema,
    storage,
    updates: {
        /* ... */
    },
    optimistic: {
        /* ... */
    },
});

app.use(urql, {
    url: 'http://localhost:8080/graph',
    exchanges: [cache, authExchange(async (utils) => {
        return {
            addAuthToOperation(operation) {
                const token = authToken.value
                if (!token) return operation

                if (!operation.context.fetchOptions) {
                    operation.context.fetchOptions = {}
                }

                if (token) {
                    // @ts-expect-error
                    operation.context.fetchOptions.headers = {
                        // @ts-expect-error
                        ...operation.context.fetchOptions.headers,
                        Authorization: token
                    }
                }

                return utils.appendHeaders(operation, {
                    Authorization: token
                })
            },
            willAuthError(_operation) {
                return false
            },
            didAuthError(error, _operation) {
                //return error.graphQLErrors.some((e) => e.extensions?.code === "UNAUTHENTICATED")
                return false
            },
            async refreshAuth() {
                // todo 
            }
        }
    }),
        fetchExchange]
});

app.use(router)

app.mount('#app')

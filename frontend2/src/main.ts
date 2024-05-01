import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import urql, { fetchExchange, gql } from '@urql/vue';
import { authExchange } from "@urql/exchange-auth"
import { authToken } from './utils/authToken';
import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { retryExchange } from '@urql/exchange-retry';

const storage = makeDefaultStorage({
    idbName: 'graphcache-v4', // The name of the IndexedDB database
    maxAge: 14, // The maximum age of the persisted data in days
});

import schema from '../schema.json'

const app = createApp(App)

const cache = offlineExchange({
    schema,
    storage,
    // updates: {
    //     Mutation: {
    //        updateEntry(_result, args, cache, _info) {
    //            const fragment = gql`fragment _ on Entry { id, date, body}`
    //
    //            cache.writeFragment(fragment, { id: args.id, date: args.date, body: args.body })
    //            console.log('updateEntry', args)
    //        }
    //     }
    // },
    optimistic: {
        updateEntry(args, cache, info) {
            console.log('optimistic updateEntry', args)
            const fragment = gql`fragment _ on Entry { id, date, body, __typename }`
            cache.writeFragment(fragment, { id: args.id, date: args.date, body: args.body, __typename: args.typename })

            return {
                __typename: 'Entry',
                id: args.id,
                date: args.date,
                body: args.body
            }

        }
    },
});

// None of these options have to be added, these are the default values.
const options = {
    initialDelayMs: 1000,
    maxDelayMs: 15000,
    randomDelay: true,
    maxNumberAttempts: 3,
    retryIf: (err: any) => err && err.networkError,
};


app.use(urql, {
    url: 'http://localhost:8080/graph',
    requestPolicy: "cache-and-network",
    exchanges: [
        cache,
        authExchange(async (utils) => {
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
        retryExchange(options),
        fetchExchange
    ]
});

app.use(router)

app.mount('#app')

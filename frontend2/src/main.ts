import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import urql, { fetchExchange, gql } from '@urql/vue'
import { authExchange } from '@urql/exchange-auth'
import { authToken } from './utils/authToken'
import { offlineExchange } from '@urql/exchange-graphcache'
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage'

const storage = makeDefaultStorage({
  idbName: 'graphcache-v4', // The name of the IndexedDB database
  maxAge: 14 // The maximum age of the persisted data in days
})

import schema from '../schema.json'

const app = createApp(App)

window.addEventListener('offline', () => {
  console.log('🔴 offline')
})

window.addEventListener('online', async () => {
  console.log('🟢 online')

  await tryQueueingOfflineMutations()
})

async function tryQueueingOfflineMutations() {
  console.log('🔄 try dequeue offline mutations')
  for (const mutation of offlineQueue) {
    console.log('🔄 dequeue offline mutation', mutation)
    await executeOfflineMutation(mutation)
    // remove from queue
  }
  offlineQueue = []
}


import type { Operation } from '@urql/core'
import { Client, mapExchange } from '@urql/core'

interface OfflineMutation {
  query: any
  variables: any
}


const cache = offlineExchange({
  schema,
  storage,
  optimistic: {
    updateEntry(args, cache, info) {
      console.log('optimistic updateEntry', args)
      const fragment = gql`fragment _ on Entry { id, date, body}`
      cache.writeFragment(fragment, { id: args.id, date: args.date, body: args.body })

      return {
        __typename: 'Entry',
        id: args.id,
        date: args.date,
        body: args.body
      }

    }
  }
})

let offlineQueue: OfflineMutation[] = []

const clientOptions = {
  url: 'http://localhost:8080/graph',
  requestPolicy: 'cache-and-network',
  exchanges: [
    cache,
    mapExchange({
      onOperation(operation) {
        // console.log('• operation', operation)
      },
      onResult(result) {
        // console.log('• result', result)
      },
      onError(error, operation) {
        // if network error, retry
        if (error.networkError) {
          console.log('• network error')
          console.log('operation', operation)
          appendOfflineMutation(operation)

        }
        // console.log('• error', error, operation)
      }
    }),
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
    // retryExchange({}),
    // mutationQueueExchange,
    fetchExchange
  ]
} as any

const client = new Client(clientOptions)

async function executeOfflineMutation(mutation: OfflineMutation) {
  const result = await client.executeMutation({query: mutation.query, variables: mutation.variables} as any)
  console.log('executed offline mutation', result)
}

function appendOfflineMutation(operation: Operation) {
  offlineQueue.push({
    query: operation.query,
    variables: operation.variables,
  })
}


app.use(urql, clientOptions)

app.use(router)

app.mount('#app')

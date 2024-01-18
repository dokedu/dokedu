import { cacheExchange, fetchExchange } from "@urql/vue"
import { authExchange } from "@urql/exchange-auth"
import { createClient, subscriptionExchange } from "@urql/vue"
import router from "../router/router"
import { publicRoutes } from "../router/publicRoutes"
import { createClient as createWSClient } from "graphql-ws"

const url = import.meta.env.VITE_API_URL as string

const ssl = url.startsWith("https") ? "s" : ""

const getToken = () => {
  return localStorage.getItem("authorization")
}

const wsClient = createWSClient({
  url: `ws${ssl}://${url.replace("http://", "").replace("https://", "")}`,
  connectionParams: async () => {
    const token = getToken()

    return {
      ...(token ? { Authorization: token } : {})
    }
  }
})

function makeClient() {
  return createClient({
    url,
    requestPolicy: "cache-and-network",
    exchanges: [
      authExchange(async (utils) => {
        return {
          addAuthToOperation(operation) {
            const token = getToken()
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
            return error.graphQLErrors.some((e) => e.extensions?.code === "UNAUTHENTICATED")
          },
          async refreshAuth() {
            const route = router.currentRoute.value
            if (!route) return
            if (!publicRoutes.includes(route.name as string)) {
              localStorage.removeItem("setupComplete")
              localStorage.removeItem("language")
              localStorage.removeItem("active_app")
              localStorage.removeItem("enabled_apps")
              localStorage.removeItem("authorization")

              await router.push({ name: "/login" })
            }
          }
        }
      }),
      fetchExchange,
      subscriptionExchange({
        forwardSubscription(request) {
          const input = { ...request, query: request.query || "" }
          return {
            subscribe(sink) {
              const unsubscribe = wsClient.subscribe(input, sink)
              return { unsubscribe }
            }
          }
        }
      })
    ]
  })
}

export default makeClient

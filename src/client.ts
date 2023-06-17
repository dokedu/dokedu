import { cacheExchange, fetchExchange } from "@urql/vue";
import { authExchange } from "@urql/exchange-auth";
import { createClient } from "@urql/vue";
import router from "./router";

const url = "http://localhost:8080/query"
const getToken = () => {
  return localStorage.getItem("authorization")
}

const client = createClient({
  url,
  requestPolicy: "cache-and-network",
  exchanges: [
    cacheExchange,
    authExchange(async utils => {
      return {
        addAuthToOperation(operation) {
          const token = getToken();
          if (!token) return operation;

          if (!operation.context.fetchOptions) {
            operation.context.fetchOptions = {};
          }

          if (token) {
            operation.context.fetchOptions.headers = {
              ...operation.context.fetchOptions.headers,
              Authorization: token,
            };
          }

          return utils.appendHeaders(operation, {
            Authorization: token,
          });
        },
        willAuthError(_operation) {
          return false;
        },
        didAuthError(error, _operation) {
          return error.graphQLErrors.some(e => e.extensions?.code === 'UNAUTHENTICATED');
        },
        async refreshAuth() {
          localStorage.removeItem('authorization')
          localStorage.removeItem('enabled_apps')
          await router.push({ name: 'login' })
        }
      }
    }),
    fetchExchange,
  ],
  // fetchOptions: () => {
  //   const token = getToken();
  //   if (token) {
  //     return {
  //       headers: { authorization: token },
  //     };
  //   }
  // },
})

export default client;
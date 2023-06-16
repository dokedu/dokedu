import { cacheExchange, fetchExchange } from "@urql/vue";
import { authExchange } from "@urql/exchange-auth";
import { createClient } from "@urql/vue";
import { useRouter } from "vue-router";

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
    const token = getToken();

    return {
      addAuthToOperation(operation) {
        if (!token) return operation;
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
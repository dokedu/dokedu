import { cacheExchange, fetchExchange } from "@urql/vue";
import { authExchange } from "@urql/exchange-auth";
import { createClient } from "@urql/vue";
import router from "./router";
import { publicRoutes } from "./router/publicRoutes";
import { useRoute } from "vue-router/auto";

const url = import.meta.env.VITE_API_URL as string;
const getToken = () => {
  return localStorage.getItem("authorization");
};

const route = useRoute()

function makeClient() {
  return createClient({
    url,
    requestPolicy: "cache-and-network",
    exchanges: [
      cacheExchange,
      authExchange(async (utils) => {
        return {
          addAuthToOperation(operation) {
            const token = getToken();
            if (!token) return operation;

            if (!operation.context.fetchOptions) {
              operation.context.fetchOptions = {};
            }

            if (token) {
              // @ts-expect-error
              operation.context.fetchOptions.headers = {
                // @ts-expect-error
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
            return error.graphQLErrors.some((e) => e.extensions?.code === "UNAUTHENTICATED");
          },
          async refreshAuth() {
            if (!route) return;
            if (!publicRoutes.includes(route.name)) {
              localStorage.removeItem("setupComplete")
              localStorage.removeItem("language")
              localStorage.removeItem("active_app")
              localStorage.removeItem("enabled_apps")
              localStorage.removeItem("authorizatio")

              await router.push({ name: "/login" });
            }
          },
        };
      }),
      fetchExchange,
    ],
  });
}

export default makeClient;

import { graphql } from "@/gql";
import { urqlClient } from "@/main";
import router from "@/router/router.ts";

function signOutMutation() {
  return urqlClient.mutation(
    graphql(`
      mutation signOut {
        signOut
      }
    `),
    {}
  );
}

async function signOut() {
  try {
    await signOutMutation();
  } catch (e) {
    console.log(e);
  }

  localStorage.removeItem("setupComplete");
  localStorage.removeItem("language");
  localStorage.removeItem("active_app");
  localStorage.removeItem("enabled_apps");
  localStorage.removeItem("authorizatio");

  await router.push({ name: "/login" });

  // ensure urql cache is cleared
  // location.reload();
}

export function useAuth() {
  return { signOut };
}

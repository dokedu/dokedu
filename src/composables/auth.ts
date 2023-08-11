import { graphql } from "@/gql";
import { urqlClient } from "@/main";


function signOutMutation() {
    return urqlClient.mutation(
        graphql(`
    mutation signOut {
      signOut
    }
  `), {}
    )
}



async function signOut() {
    const res = await signOutMutation();
    if (res.error) return console.error(res.error);

    // Clear the token and enabled_apps from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("enabled_apps");

    // TODO: hack to ensure urql cache is cleared
    location.reload();
}

export function useAuth() {
    return { signOut }
}
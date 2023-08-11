import { graphql } from "@/gql";
import { urqlClient } from "@/main";
import router from "@/router";


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
  try {
    const res = await signOutMutation();
    if (res.error) return console.error(res.error);
  } catch (err) {
    console.error(err);
  }

  localStorage.clear()
  await router.push({ name: "/login" });
  // ensure urql cache is cleared
  location.reload();

}

export function useAuth() {
  return { signOut }
}
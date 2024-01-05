import { urqlClient } from "@/main"
import router from "@/router/router"
import { SignOutDocument } from "@/gql/mutations/auth/signOut"

function signOutMutation() {
  return urqlClient.mutation(SignOutDocument, {})
}

async function signOut() {
  try {
    await signOutMutation()
  } catch (e) {
    console.log(e)
  }

  localStorage.removeItem("setupComplete")
  localStorage.removeItem("language")
  localStorage.removeItem("active_app")
  localStorage.removeItem("enabled_apps")
  localStorage.removeItem("authorizatio")

  await router.push({ name: "/login" })

  // ensure urql cache is cleared
  // location.reload();
}

export function useAuth() {
  return { signOut }
}

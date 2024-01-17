import { SignOutDocument } from "@/gql/mutations/auth/signOut"
import { SignInDocument } from "@/gql/mutations/auth/signIn"
import { useStorage, useWindowSize } from "@vueuse/core"
import router from "@/router/router"
import { urqlClient } from "@/main"
import { computed } from "vue"
import i18n from "@/i18n"
import { $posthog } from "@/plugins/posthog"
import type { UserFragment } from "@/gql/fragments/user"

export const user = useStorage<UserFragment | null>("user", null,
  undefined,
  {
    serializer: {
      read: (v: any) => v ? JSON.parse(v) : null,
      write: (v: any) => JSON.stringify(v),
    },
  })
export const token = useStorage<null | string>("authorization", null)
export const setupComplete = useStorage("setupComplete", false)
export const enabledApps = useStorage<string[]>("enabled_apps", [])
export const language = useStorage("language", "en")

const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 900)

function signOutMutation() {
  return urqlClient.mutation(SignOutDocument, {})
}

interface SignInInput {
  email: string
  password: string
}

function signInMutation({ email, password }: SignInInput) {
  return urqlClient.mutation(SignInDocument, { email, password })
}


async function signIn({ email, password }: SignInInput): Promise<{ error?: Error | undefined }> {
  const { data, error } = await signInMutation({
    email: email,
    password: password
  })

  if (error) {
    return { error: new Error(error.graphQLErrors[0].message) }
  }

  if (!data?.signIn.token) {
    return { error: new Error("No token returned") }
  }

  user.value = data.signIn.user
  token.value = data.signIn.token
  setupComplete.value = data.signIn.setupComplete
  enabledApps.value = data.signIn.enabled_apps
  language.value = data.signIn.language

  // Set the i18n locale to the user's language
  i18n.global.locale.value = language as unknown as any

  identifyUser()

  afterSignInHandleRedirect()

  return {}
}

export function identifyUser() {
  if (!user.value) return;
  if (!$posthog) return;

  try {
    $posthog.identify(
      user.value.id,  // Replace 'distinct_id' with your user's unique identifier
      {
        email: user.value.email, name:
          user.value.firstName + " " + user.value.lastName
      } // optional: set additional user properties
    );
    $posthog.group('company', user.value.organisationId)
  } catch (e) {
    console.error(e)
  }


}


async function afterSignInHandleRedirect() {
  if (!setupComplete.value) {
    return await router.push({ name: "/setup/" })
  }

  if (enabledApps.value.includes("record")) {
    if (isMobile.value) {
      return await router.push({ name: "/m/record/entries/" })
    } else {
      return await router.push({ name: "/record/entries/" })
    }
  } else if (enabledApps.value.includes("drive")) {
    return await router.push({ name: "/drive/my-drive/" })
  } else {
    return await router.push({ name: "/settings/profile" })
  }
}

async function signOut() {
  try {
    await signOutMutation()
  } catch (e) {
    console.error(e)
  }

  // localStorage.removeItem("setupComplete")
  // localStorage.removeItem("language")
  // localStorage.removeItem("active_app")
  // localStorage.removeItem("enabled_apps")
  // localStorage.removeItem("authorizatio")
  user.value = null
  token.value = null
  setupComplete.value = false
  enabledApps.value = []

  try {
    $posthog?.reset()
  } catch (e) {
    console.error(e)
  }

  await router.push({ name: "/login" })
}

export function useAuth() {
  return { signOut, signIn }
}

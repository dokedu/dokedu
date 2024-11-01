import { SignOutDocument } from "@/gql/mutations/auth/signOut"
import { SignInDocument } from "@/gql/mutations/auth/signIn"
import { useStorage, useWindowSize } from "@vueuse/core"
import router from "@/router/router"
import { urqlClient } from "@/main"
import { computed } from "vue"
import i18n from "@/i18n"
import type { UserFragment } from "@/gql/fragments/user"

export const user = useStorage<UserFragment | null>("user", null, undefined, {
  serializer: {
    read: (v: any) => (v ? JSON.parse(v) : null),
    write: (v: any) => JSON.stringify(v)
  }
})
export const token = useStorage<null | string>("authorization", null)
export const enabledApps = useStorage<string[]>("enabled_apps", [])
export const language = useStorage<string>("language", "en")

const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 900)

function signOutMutation() {
  return urqlClient.mutation(SignOutDocument, {})
}

async function signIn(_token: string, _user: UserFragment): Promise<{ error?: Error | undefined }> {
  token.value = _token
  user.value = _user
  enabledApps.value = ["admin", "record", "school", "drive"]
  language.value = "de"

  // Set the i18n locale to the user's language
  i18n.global.locale.value = language.value as unknown as any

  await afterSignInHandleRedirect()

  return {}
}

async function afterSignInHandleRedirect() {
  if (enabledApps.value.includes("record")) {
    if (isMobile.value) {
      return await router.push({ name: "/m/record/entries/" })
    } else {
      return await router.push({ name: "/record/entries/" })
    }
  } else if (enabledApps.value.includes("drive")) {
    return await router.push({ name: "/drive/my-drive/" })
  } else if (enabledApps.value.includes("mail")) {
    return await router.push({ name: "/mail/" })
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

  user.value = null
  token.value = null
  enabledApps.value = []

  await router.push({ name: "/login" })
}

export function useAuth() {
  return { signOut, signIn }
}

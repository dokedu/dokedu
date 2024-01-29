import { language } from "@/composables/auth"
export default function useTime(dateString: string, opts?: object) {
  const date = new Date(dateString)
  if (!opts) {
    opts = { hour: "numeric", minute: "numeric" }
  }
  return date.toLocaleTimeString(language.value, opts)
}

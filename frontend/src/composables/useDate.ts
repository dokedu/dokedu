import { language } from "@/composables/auth"
export default function useTime(dateString: string, opts?: object) {
  const date = new Date(dateString)
  if (!opts) {
    opts = { year: "numeric", month: "2-digit", day: "2-digit" }
  }
  return date.toLocaleDateString(language.value, opts)
}

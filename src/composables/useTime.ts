import { language } from "@/composables/auth"
export default function useTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString(language.value, { hour: "numeric", minute: "numeric" })
}

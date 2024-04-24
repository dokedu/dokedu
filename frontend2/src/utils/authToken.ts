import { useStorage } from "@vueuse/core"

export const authToken = useStorage<null | string>("authorization", null)
import PageNotification from "@/components/d-notification/d-notification.vue"
import type { Props } from "@/components/d-notification/d-notification.vue"
import { createApp } from "vue"

export function createNotification(props: Props) {
  const notification = document.createElement("div")
  const modal = createApp(
    {
      ...PageNotification,
      unmounted() {
        notification.remove()
      }
    },
    {
      ...props,
      onClose() {
        modal.unmount()
      }
    }
  )

  document.body.append(notification)
  modal.mount(notification)
}

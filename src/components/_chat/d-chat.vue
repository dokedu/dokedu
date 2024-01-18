<template>
  <router-link :to="`/chat/chats/` + chat?.id" class="px-2 py-px">
    <div
      class="p-3 flex items-center gap-2.5 rounded-md"
      :class="active ? `bg-inverted text-white` : `hover:bg-neutral-900/5`"
    >
      <d-avatar :initials="chat?.name ? useInitials(chat.name) : ''" :inverted="active" :icon="UserRound" />
      <div class="flex-1 w-full">
        <div class="flex mb-1">
          <div class="font-semibold flex-1">{{ chat?.name }}</div>
          <!-- TODO: implement real time based on lastMessage -->
          <div class="text-xs" :class="active ? 'text-white' : 'text-subtle'">6:30</div>
        </div>
        <div class="flex">
          <div class="text-xs line-clamp-1 flex-1" :class="active ? 'text-white' : 'text-subtle'">
            {{ chat?.lastMessage ? chat?.lastMessage : $t("no_messages_yet") }}
          </div>
          <d-notification-circle :amount="chat.unreadMessagesCount" :inverted="active"></d-notification-circle>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Chat } from "@/gql/schema"
import DAvatar from "@/components/d-avatar/d-avatar.vue"
import { UserRound } from "lucide-vue-next"
import useInitials from "@/composables/useInitials"
import DNotificationCircle from "@/components/_chat/d-notification-circle.vue"

type Props = {
  chat: Chat
  active: boolean
}

defineProps<Props>()
</script>

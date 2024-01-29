<template>
  <router-link :to="`/chat/chats/` + chat?.id" class="px-2 py-px">
    <div
      class="p-3 flex items-center gap-2.5 rounded-md"
      :class="active ? `bg-inverted text-white` : `hover:bg-neutral-900/5`"
    >
      <d-avatar :initials="chat?.name ? useInitials(chat.name) : ''" :inverted="active" :icon="UserRound" />
      <div class="flex-1 w-full min-w-0">
        <div class="flex mb-1">
          <div class="font-semibold flex-1">{{ chat?.name }}</div>
          <!-- TODO: implement real time based on lastMessage -->
          <div v-if="chat?.lastMessage" class="text-xs" :class="active ? 'text-white' : 'text-subtle'">
            {{ useTime(chat?.lastMessage?.createdAt) }}
          </div>
        </div>
        <div class="flex gap-2">
          <div class="text-xs line-clamp-1 flex-1" :class="active ? 'text-white' : 'text-subtle'">
            {{ chat?.lastMessage ? chat?.lastMessage.message : `No messages yet` }}
          </div>
          <d-notification-circle :amount="chat.unreadMessageCount" :inverted="active"></d-notification-circle>
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
import useTime from "@/composables/useTime"
import { toRef } from "vue"

type Props = {
  chat: Chat
  active: boolean
}

const props = defineProps<Props>()
const chat = toRef(props, "chat")
</script>

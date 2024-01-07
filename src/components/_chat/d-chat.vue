<template>
  <router-link :to="`/chat/chats/` + chat?.id" class="px-2 py-px">
    <div
      class="p-3 flex items-center gap-2.5 rounded-xl"
      :class="active ? `bg-inverted text-white ` : `hover:bg-neutral-900/5`"
    >
      <d-avatar :initials="chat?.name ? getInitials(chat.name) : ''" :inverted="active" :icon="UserRound" />
      <div class="flex-1 w-full">
        <div class="flex mb-1">
          <div class="font-semibold flex-1">{{ chat?.name }}</div>
          <div class="text-xs text-subtle">6:20 PM</div>
        </div>

        <div class="text-neutral-500 text-xs line-clamp-1">
          {{ chat?.lastMessage ? chat?.lastMessage : `No messages yet` }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Chat } from "@/gql/schema"
import DAvatar from "@/components/d-avatar/d-avatar.vue"
import { UserRound } from "lucide-vue-next"

type Props = {
  chat: Chat
  active: boolean
}

defineProps<Props>()

function getInitials(name: string) {
  if (name === "New chat") return ""
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
}
</script>

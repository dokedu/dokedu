<template>
  <router-link :to="`/chat/chats/` + chat?.id" class="px-2 py-px">
    <div
      class="p-2 flex items-center gap-2.5 rounded-xl"
      :class="active ? `bg-inverted text-white ` : `hover:bg-neutral-900/5`"
    >
      <div class="h-12 w-12 rounded-full bg-neutral-900/10"></div>
      <div class="flex-1 w-full">
        <div class="font-semibold mb-1">{{ chat?.name }}</div>
        <div class="text-neutral-500 text-xs line-clamp-2 h-[2rem]">
          {{ chat?.lastMessage ? chat?.lastMessage : `No messages yet` }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Chat } from "@/gql/schema"

type Props = {
  chat: Chat
  active: boolean
}

defineProps<Props>()
</script>

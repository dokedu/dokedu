<template>
  <div class="px-4 w-full rounded-[inherit] group" style="overflow: hidden scroll">
    <div class="flex items-start max-w-[80%]" :class="me ? `justify-end ml-auto` : `justify-start`">
      <div
        class="bg-neutral-100 rounded-xl py-1 px-2 w-fit whitespace-pre-wrap flex"
        :class="`
        ${me ? `self-end group-last:rounded-br-none` : `border bg-white group-last:rounded-bl-none`} 
        ${stacked ? `flex-col justify-end` : `flex-row items-center gap-2`}`"
      >
        <div class="flex-1">
          <div v-if="showName" class="group-first:block hidden text-xs font-medium text-blue-500">
            {{ fullName(message.user) }}
          </div>
          <d-markdown :source="message.message" class=""></d-markdown>
        </div>
        <div class="text-xs text-subtle flex justify-end">
          {{ formatTime(message.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ChatMessage } from "@/gql/schema"
import DMarkdown from "@/components/d-markdown/d-markdown.vue"
import { computed } from "vue"

type Props = {
  message: ChatMessage
  me?: boolean
  type: "PRIVATE" | "GROUP" | "CHANNEL"
}

const props = defineProps<Props>()

const showName = computed(() => {
  return (props.type === "GROUP" || props.type === "CHANNEL") && !props.me
})

const stacked = computed(() => {
  // if message is too long to fit in one line, stack it
  return props.message.message.length > 50
})

function fullName(user: { firstName: string; lastName: string }) {
  return `${user.firstName} ${user.lastName}`
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })
}
</script>

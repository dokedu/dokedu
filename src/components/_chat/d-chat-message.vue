<template>
  <div class="px-4 w-full select-none rounded-[inherit] group" style="overflow: hidden scroll" @click="editTest">
    <div class="flex items-start max-w-[80%]" :class="me ? `justify-end ml-auto` : `justify-start`">
      <div
        class="rounded-xl py-1 px-2 w-fit whitespace-pre-wrap flex flex-col relative"
        :class="`
          ${
            me
              ? `self-end group-last:rounded-br-none bg-inverted text-white`
              : `border bg-white group-last:rounded-bl-none`
          } 
        `"
      >
        <div v-if="showName" class="group-first:block hidden text-xs font-medium text-blue-500">
          {{ fullName(message.user) }}
        </div>
        <div class="flex" :class="`${stacked ? `flex-col justify-end` : `flex-row items-baseline gap-2`}`">
          <d-markdown :inverted="me" :source="message.message" ref="messageText" class="select-text"></d-markdown>
          <div v-show="message.isEdited" class="text-subtle text-xs text-right italic">edited</div>
          <div class="text-xs text-subtle flex justify-end italic">
            {{ useTime(message.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import DMarkdown from "@/components/d-markdown/d-markdown.vue"
import { computed, ref } from "vue"
import { useElementSize } from "@vueuse/core"
import { useEditChatMessageMutation } from "@/gql/mutations/chats/editChatMessage"
import type { ChatMessageFragment } from "@/gql/fragments/chatMessage"
import useTime from "@/composables/useTime"

type Props = {
  message: ChatMessageFragment
  me?: boolean
  type: "PRIVATE" | "GROUP" | "CHANNEL"
}

const props = defineProps<Props>()
const messageText = ref<HTMLElement | null>(null)
const { height } = useElementSize(messageText)

const showName = computed(() => {
  return (props.type === "GROUP" || props.type === "CHANNEL") && !props.me
})

const stacked = computed(() => {
  // stack if message is higher than 24px or longer than 50 chars
  return height.value > 24 || props.message.message.length > 50
})

function fullName(user: { firstName: string; lastName: string }) {
  return `${user.firstName} ${user.lastName}`
}

const { executeMutation: editChatMessageMut } = useEditChatMessageMutation()

async function editTest() {
  const ext = Math.random().toString(36).substring(7)
  await editChatMessageMut({
    input: {
      id: props.message.id,
      message: ext
    }
  })
}
</script>

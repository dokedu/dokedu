<template>
  <ContextMenuRoot>
    <ContextMenuTrigger
      class="px-4 w-full select-none rounded-[inherit] group"
      style="overflow: hidden scroll"
      as-child
    >
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
            <div class="text-xs text-subtle flex justify-end italic gap-1">
              <div v-show="message.isEdited">edited</div>
              <div>{{ useTime(message.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <d-context-content>
        <d-context-item v-if="isSupported" @click="copy(message.message)">
          <Copy class="size-5" />
          <span>{{ $t("copy_text") }}</span>
        </d-context-item>
        <d-context-item v-if="me" @click="$emit('edit', message)">
          <PenSquare class="size-5" />
          <span>{{ $t("edit") }}</span>
        </d-context-item>
        <d-context-item @click="$emit('delete', message)">
          <Trash2 class="size-5" />
          <span>{{ $t("delete") }}</span>
        </d-context-item>
      </d-context-content>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
<script setup lang="ts">
import DMarkdown from "@/components/d-markdown/d-markdown.vue"
import { computed, ref } from "vue"
import { useElementSize } from "@vueuse/core"
import type { ChatMessageFragment } from "@/gql/fragments/chatMessage"
import useTime from "@/composables/useTime"
import { ContextMenuRoot, ContextMenuTrigger, ContextMenuPortal, ContextMenuContent } from "radix-vue"
import DContextItem from "@/components/d-context-next/d-context-item.vue"
import DContextContent from "@/components/d-context-next/d-context-content.vue"
import { PenSquare, Trash2, Copy } from "lucide-vue-next"
import { useClipboard } from "@vueuse/core"

type Props = {
  message: ChatMessageFragment
  me?: boolean
  type: "PRIVATE" | "GROUP" | "CHANNEL"
}
const props = defineProps<Props>()

type Emit = {
  (event: "edit", message: ChatMessageFragment): void
  (event: "delete", message: ChatMessageFragment): void
}
defineEmits<Emit>()

const messageText = ref<HTMLElement | null>(null)
const { height } = useElementSize(messageText)
const { copy, copied, isSupported } = useClipboard({ source: props.message.message })

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
</script>

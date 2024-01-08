<template>
  <div class="flex flex-col h-screen w-full">
    <router-link
      :to="`/chat/chats/${route.params.id}/edit`"
      class="px-4 border-b shadow-sm w-full grid grid-cols-3 h-16 justify-between items-center"
    >
      <div class="flex gap-2.5">
        <d-avatar :initials="useInitials(data?.chat.name)" :icon="UserRound"></d-avatar>
        <div>
          <div class="text-md font-medium">
            {{ data?.chat.name ? data?.chat.name : `Unnamed chat` }}
          </div>
          <div class="text-xs text-neutral-400">last seen 1 minute ago</div>
        </div>
      </div>
      <div></div>
      <div></div>
    </router-link>
    <div ref="messageContainer" class="h-full flex-1 overflow-auto">
      <div v-for="(group, _) in groupedMessages" :key="_" class="my-4 flex flex-col gap-1">
        <d-chat-message
          v-for="message in group"
          :key="message.id"
          :message="message"
          :me="message.user.id === userData?.me?.id"
          type="GROUP"
        ></d-chat-message>
      </div>
      <div v-if="data?.chat.messages.length === 0" class="h-full">
        <d-empty
          :icon="MessageCircle"
          title="Looks like you don't have any messages yet"
          text="Be the first to say hi!"
        ></d-empty>
      </div>
    </div>
    <footer class="w-full flex gap-2 items-end px-4 border-t bg-white">
      <div class="h-14 flex items-center gap-1">
        <d-icon-button size="md" :icon="Paperclip"></d-icon-button>
      </div>
      <textarea
        ref="textarea"
        v-model="input"
        type="text"
        placeholder="Write a message..."
        class="w-full max-h-[40vh] resize-none block py-4 border-none h-full bg-transparent text-neutral-900 placeholder:text-neutral-400 ring-0 focus:outline-none focus:ring-0 text-sm leading-6"
        @keydown.enter.exact.prevent="onSubmit"
        @keydown.enter.shift.prevent="input += '\n'"
      />
      <div class="h-14 flex items-center gap-1">
        <d-icon-button size="lg" :icon="Smile"></d-icon-button>
        <d-icon-button
          size="lg"
          :icon="SendHorizonal"
          @click="onSubmit"
          :type="input ? 'primary' : 'secondary'"
        ></d-icon-button>
      </div>
    </footer>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "layout": "chat"
  }
}
</route>

<script setup lang="ts">
import { useRoute } from "vue-router/auto"
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue"
import { useTextareaAutosize } from "@vueuse/core"
import { useChatQuery } from "@/gql/queries/chats/chat"
import { useMeQuery } from "@/gql/queries/auth/me"
import { useSendMessageMutation } from "@/gql/mutations/chats/sendMessage"
import { useMessageAddedSubscription } from "@/gql/subscriptions/messageAdded"
import DEmpty from "@/components/d-empty/d-empty.vue"
import DChatMessage from "@/components/_chat/d-chat-message.vue"
import DIconButton from "@/components/d-icon-button/d-icon-button.vue"
import DAvatar from "@/components/d-avatar/d-avatar.vue"
import { MessageCircle, Paperclip, SendHorizonal, Smile, UserRound } from "lucide-vue-next"
import useInitials from "@/composables/useInitials"
const route = useRoute("/chat/[tab]/[id]/")
const id = computed(() => route.params.id)
const messageContainer = ref<HTMLElement>()
const { textarea, input } = useTextareaAutosize()

const { data, executeQuery: refresh } = useChatQuery({
  variables: reactive({
    id: id
  })
})

const { data: userData } = useMeQuery({})

const groupedMessages = computed(() => {
  let groups: any = []
  // group messages if they are less than x minutes apart and from the same user
  let timeApart = 1000 * 60 // 1 minute
  data?.value?.chat?.messages?.forEach((message: any) => {
    if (groups.length === 0) {
      groups.push([message])
    } else {
      const lastGroup = groups[groups.length - 1]
      const lastMessage = lastGroup[lastGroup.length - 1]
      const lastMessageDate = new Date(lastMessage.createdAt)
      const messageDate = new Date(message.createdAt)

      // only group if the messages are from the same user
      const sameUser = lastMessage.user.id === message.user.id
      // only group if the messages are less than 2 minutes apart
      const sameTimeFrame = messageDate.getTime() - lastMessageDate.getTime() < timeApart

      if (sameUser && sameTimeFrame) {
        lastGroup.push(message)
      } else {
        groups.push([message])
      }
    }
  })
  return groups
})

const { executeMutation: sendMessageMutation } = useSendMessageMutation()

async function onSubmit() {
  await sendMessage(input.value.replace(/^\s+|\s+$/g, ""))
  input.value = ""
}

async function sendMessage(message: string) {
  if (!message) return
  if (message.length === 0) return
  await sendMessageMutation({
    input: {
      chatId: id.value,
      message: message
    }
  })
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

async function handleSubscription() {
  await refresh()
}

useMessageAddedSubscription(
  {
    variables: reactive({
      chatId: id
    })
  },
  handleSubscription
)

onMounted(() => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
})

watch(
  [data],
  () => {
    nextTick(() => {
      scrollToBottomConditionally()
    })
  },
  {
    flush: "post"
  }
)

function scrollToBottomConditionally() {
  if (messageContainer.value) {
    // only scroll if the user is close to the bottom of the chat
    if (
      messageContainer.value.scrollTop + messageContainer.value.clientHeight + 100 >=
      messageContainer.value.scrollHeight
    ) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  }
}

watch(
  [id],
  () => {
    nextTick(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    })
  },
  {
    flush: "post"
  }
)
</script>

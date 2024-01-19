<template>
  <div class="flex flex-col h-screen w-full">
    <router-link
      :to="`/chat/chats/${route.params.id}/edit`"
      class="px-4 border-b shadow-sm w-full grid grid-cols-3 h-16 justify-between items-center"
    >
      <div class="flex gap-2.5">
        <d-avatar :initials="useInitials(data?.chat.name)" :icon="UserRound"></d-avatar>
        <div class="flex justify-center flex-col">
          <div class="text-md font-medium">
            {{ data?.chat.name ? data?.chat.name : $t("unnamed_chat") }}
          </div>
          <div v-if="data?.chat.type === 'PRIVATE'" class="text-xs text-neutral-400">
            <!-- TODO: add actual last seen time -->
            {{ lastSeen }}
          </div>
          <div v-if="data?.chat.type === 'GROUP' && data?.chat.userCount > 1" class="text-xs text-neutral-400">
            {{ $t("amount_group_members", { amount: data?.chat.userCount }) }}
          </div>
        </div>
      </div>
    </router-link>
    <div ref="messageContainer" class="h-full flex-1 overflow-auto">
      <div ref="root" v-for="(group, _) in groupedMessages" :key="_" class="my-4 flex flex-col gap-1">
        <d-chat-message
          v-for="message in group"
          :target="root"
          :key="message.id"
          :message="message"
          :data-message-id="message.id"
          :data-message-seen="message.isSeen"
          :me="message.user.id === userData?.me?.id"
          @edit="
            (message) => {
              startEditMessage(message)
            }
          "
          @delete="
            (message) => {
              deleteMessage(message)
            }
          "
          type="GROUP"
        ></d-chat-message>
      </div>
      <div v-if="data?.chat.messages.length === 0" class="h-full">
        <d-empty :icon="MessageCircle" :title="$t('empty_chat_title')" :text="$t('empty_chat_description')"></d-empty>
      </div>
    </div>
    <footer class="w-full flex gap-2 items-end px-4 border-t bg-white">
      <div class="w-full" v-show="showEditMessage">
        <div class="rounded-md border-b border-subtle py-3 pl-3">
          <div class="flex items-center gap-2">
            <div>
              <PenSquare class="size-5" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-bold text-strong">{{ $t("edit_message") }}</div>
              <div class="text-sm text-subtle line-clamp-1">{{ currentEditMessage?.message }}</div>
            </div>
            <d-icon-button size="md" :icon="XIcon" @click="cancelEditMessage"></d-icon-button>
          </div>
        </div>
        <div class="flex gap-2 items-end w-full">
          <textarea
            ref="textareaEdit"
            v-model="inputEditMessage"
            type="text"
            :placeholder="$t('message_input_placeholder')"
            class="w-full max-h-[40vh] resize-none block py-4 border-none h-full bg-transparent text-neutral-900 placeholder:text-neutral-400 ring-0 focus:outline-none focus:ring-0 text-sm leading-6"
            @keydown.enter.exact.prevent="submitEditMessage"
          />
          <div class="h-14 flex items-center gap-1">
            <d-icon-button size="md" :icon="Check" @click="submitEditMessage" type="primary"></d-icon-button>
          </div>
        </div>
      </div>
      <div class="flex gap-2 items-end w-full" v-show="!showEditMessage">
        <textarea
          ref="textarea"
          v-model="input"
          type="text"
          :placeholder="$t('message_input_placeholder')"
          class="w-full max-h-[40vh] resize-none block py-4 border-none h-full bg-transparent text-neutral-900 placeholder:text-neutral-400 ring-0 focus:outline-none focus:ring-0 text-sm leading-6"
          @keydown.enter.exact.prevent="onSubmit"
        />
        <div class="h-14 flex items-center gap-1">
          <d-icon-button
            size="md"
            :icon="SendHorizonal"
            @click="onSubmit"
            :type="input ? 'primary' : 'outline'"
          ></d-icon-button>
        </div>
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
import { onKeyStroke, useTextareaAutosize } from "@vueuse/core"
import { useChatQuery } from "@/gql/queries/chats/chat"
import { useMeQuery } from "@/gql/queries/auth/me"
import { useSendMessageMutation } from "@/gql/mutations/chats/sendMessage"
import { useMessageAddedSubscription } from "@/gql/subscriptions/messageAdded"
import DEmpty from "@/components/d-empty/d-empty.vue"
import DChatMessage from "@/components/_chat/d-chat-message.vue"
import DIconButton from "@/components/d-icon-button/d-icon-button.vue"
import DAvatar from "@/components/d-avatar/d-avatar.vue"
import { MessageCircle, PenSquare, Paperclip, SendHorizonal, Smile, UserRound, Check, XIcon } from "lucide-vue-next"
import useInitials from "@/composables/useInitials"
import useTime from "@/composables/useTime"
import useDate from "@/composables/useDate"
import type { User } from "@/gql/schema"
import i18n from "@/i18n"
import { useIntersectionObserver } from "@vueuse/core"
import { useMarkMessageAsReadMutation } from "@/gql/mutations/chats/markMessageAsRead"
import type { ChatMessageFragment } from "@/gql/fragments/chatMessage"
import { useEditChatMessageMutation } from "@/gql/mutations/chats/editChatMessage"
// import { useDeleteChatMessageMutation } from "@/gql/mutations/chats/deleteChatMessage"

const route = useRoute("/chat/[tab]/[id]/")
const id = computed(() => route.params.id)
const messageContainer = ref<HTMLElement>()
const { textarea, input } = useTextareaAutosize()

const { textarea: textareaEdit, input: inputEditMessage } = useTextareaAutosize()

const showEditMessage = ref(false)
const currentEditMessage = ref<ChatMessageFragment | null>(null)

const root = ref(null)

const props = defineProps<{
  refreshChat: () => Promise<void>
}>()

onKeyStroke("Escape", () => {
  cancelEditMessage()
})

const { executeMutation: markAsRead } = useMarkMessageAsReadMutation()

useIntersectionObserver(root, async ([{ isIntersecting, target }]) => {
  let promises = []

  for (const child of target.children) {
    if (child.getAttribute("data-message-id")) {
      const messageId = child.getAttribute("data-message-id")
      const seen = (child.getAttribute("data-message-seen") === "true" ? true : false) || false
      if (seen) continue
      if (!messageId) continue
      promises.push(markAsRead({ messageId: messageId }))
    }
  }

  const wilLRefresh = isIntersecting && promises.length > 0

  await Promise.all(promises)

  if (wilLRefresh) {
    await refresh()
    await props.refreshChat()
  }
})

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

  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
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

function startEditMessage(message: ChatMessageFragment) {
  showEditMessage.value = true
  currentEditMessage.value = message
  inputEditMessage.value = message.message
  nextTick(() => {
    textareaEdit.value?.focus()
  })
}

function submitEditMessage() {
  if (!currentEditMessage.value) return
  updateMessage(currentEditMessage.value, inputEditMessage.value)
  showEditMessage.value = false
  currentEditMessage.value = null
  inputEditMessage.value = ""
}

function cancelEditMessage() {
  showEditMessage.value = false
  currentEditMessage.value = null
  inputEditMessage.value = ""
}

const { executeMutation: editChatMessageMut } = useEditChatMessageMutation()
async function updateMessage(message: ChatMessageFragment, newMessage: string) {
  await editChatMessageMut({
    input: {
      id: message.id,
      message: newMessage
    }
  })
}

// const { executeMutation: deleteChatMessageMut } = useDeleteChatMessageMutation()
async function deleteMessage(message: ChatMessageFragment) {
  console.log(message)
  // await deleteChatMessageMut({
  //   input: {
  //     id: message.id
  //   }
  // })
}

async function handleSubscription() {
  await refresh()
}

function getOtherUser(): User | null {
  // filter out me and return the only other user
  return data?.value?.chat?.users?.filter((user: any) => user.id !== userData?.value?.me?.id)[0]
}

const lastSeen = computed(() => {
  if (!data?.value?.chat?.users) return null
  const otherUser = getOtherUser()
  if (!otherUser) return null
  if (!otherUser.lastSeenAt) return

  const lastSeenMinutes = getLastSeenMinutes(otherUser)
  // if the user was last seen less than 1 minute ago, show "online"
  if (lastSeenMinutes < 1) {
    return i18n.global.t("online")
  }

  // if the user was last seen less than 60 minutes ago, show the minutes
  if (lastSeenMinutes < 60) {
    return i18n.global.t("last_seen", { time: `${lastSeenMinutes} ${i18n.global.t("minute", 2)}` })
  }

  // if the user was last seen more than 24 hours ago, show the date
  if (lastSeenMinutes > 60 * 24) {
    return useDate(otherUser.lastSeenAt)
  }

  // if the user was last seen more than 60 minutes ago, show the time
  if (lastSeenMinutes > 60) {
    return useTime(otherUser.lastSeenAt)
  }

  return 0
})

function getLastSeenMinutes(user: any) {
  if (!user) return 0
  if (!user.lastSeenAt) return 0

  const lastSeen = new Date(user.lastSeenAt)
  const now = new Date()
  const diff = now.getTime() - lastSeen.getTime()
  const minutes = Math.round(diff / 1000 / 60)
  return minutes
}

useMessageAddedSubscription({}, handleSubscription)

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

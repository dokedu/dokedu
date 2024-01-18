<template>
  <div class="flex flex-col h-screen w-full">
    <div class="px-4 border-b shadow-sm w-full grid grid-cols-3 h-16 justify-between items-center">
      <router-link :to="`/chat/chats/${route.params.id}/`">
        <d-button type="transparent" :icon-left="ChevronLeft">Back</d-button>
      </router-link>
      <template v-if="data?.chat.type !== ChatType['Group']">
        <router-link :to="`/chat/chats/${route.params.id}/edit`" class="font-semibold text-center flex-1">
          {{ data?.chat.name ? data?.chat.name : `Unnamed chat` }}
        </router-link>
        <div></div>
      </template>
      <template v-else>
        <d-input
          v-model="chatName"
          type="text"
          name="name"
          placeholder="Chat name"
          class="w-full border-none bg-transparent"
        />
        <div class="flex justify-end">
          <d-button @click="updateChat" size="md">Save</d-button>
        </div>
      </template>
    </div>
    <div class="max-w-lg pt-4 flex flex-col gap-4 mx-auto w-full">
      <div class="px-4 flex justify-center gap-4">
        <d-button-add-chat-user :chat-id="route.params.id" />
        <d-button type="outline" @click="soon">Leave</d-button>
        <d-button type="outline" @click="deleteChat">Delete</d-button>
      </div>
      <div class="px-4 divide-y">
        <div class="group p-2 flex justify-between items-center" v-for="user in data?.chat.users" :key="user.id">
          <div>
            <div class="mb-1">{{ user.firstName }} {{ user.lastName }}</div>
            <div class="text-neutral-500 text-xs min-h-[1rem]">{{ user.email ? user.email : user.id }}</div>
          </div>
          <d-button
            @click="removeUserFromChat(user.id)"
            type="transparent"
            class="hidden group-hover:block text-red-500 hover:text-red-500"
          >
            Remove
          </d-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router/auto"
import { computed, reactive } from "vue"
import DButton from "@/components/d-button/d-button.vue"
import { ChevronLeft } from "lucide-vue-next"
import DButtonAddChatUser from "@/components/_chat/d-button-add-chat-user.vue"
import DInput from "@/components/d-input/d-input.vue"
import { useChatWithMembersQuery } from "@/gql/queries/chats/chatWithMembers"
import { useUpdateChatMutation } from "@/gql/mutations/chats/updateChat"
import { useRemoveUserFromChatMutation } from "@/gql/mutations/chats/removeUserFromChat"
import { ChatType } from "@/gql/schema"
import { useDeleteChatMutation } from "@/gql/mutations/chats/deleteChat"
import { useRouter } from "vue-router/auto"

const route = useRoute("/chat/[tab]/[id]/edit")
const router = useRouter()

const id = computed(() => route.params.id)

const { data } = useChatWithMembersQuery({
  variables: reactive({
    id: id
  })
})

const { executeMutation } = useUpdateChatMutation()
const { executeMutation: deleteChatMut } = useDeleteChatMutation()

async function updateChat() {
  await executeMutation({
    input: {
      id: id.value,
      name: chatName.value
    }
  })
}

const chatName = computed({
  get: () => data?.value?.chat.name || "",
  set: (value: string) => {
    if (data.value) {
      data.value.chat.name = value
    }
  }
})

const { executeMutation: removeUserFromChatMut } = useRemoveUserFromChatMutation()

async function removeUserFromChat(userId: string) {
  await removeUserFromChatMut({
    input: {
      chatId: id.value,
      userId: userId
    }
  })
}

async function deleteChat() {
  const a = confirm("Are you sure you want to remove this user from the chat?")
  if (!a) return
  await deleteChatMut({
    input: {
      id: id.value
    }
  })
  await router.push("/chat/chats")
}

function soon() {
  alert("This feature is coming soon!")
}
</script>

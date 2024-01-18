<template>
  <div class="text-sm flex h-screen w-full">
    <div class="flex flex-col w-[300px] border-r bg-neutral-50 h-full">
      <div class="p-2.5">
        <app-switcher2 />
      </div>
      <div class="px-2.5 pt-0 pb-2 flex justify-between gap-1 border-b">
        <d-input class="w-full" v-model="search" name="search" type="text" placeholder="Search"></d-input>
        <d-new-chat />
      </div>
      <div class="flex-1 overflow-auto flex flex-col">
        <div class="h-full flex flex-col" v-show="tab === 'chats'">
          <div v-if="false" class="pt-2 px-2">
            <d-tabs>
              <d-tab active>All</d-tab>
              <d-tab>Friends</d-tab>
              <d-tab>Family</d-tab>
              <d-tab>Work</d-tab>
              <d-tab>Bots</d-tab>
            </d-tabs>
          </div>
          <div class="flex flex-col overflow-scroll flex-1 pt-2">
            <d-chat
              v-for="_chat in chatList?.chats?.edges"
              :chat="_chat"
              :active="_chat?.id === chat"
              :key="_chat?.id"
            ></d-chat>
          </div>
        </div>
        <div v-show="tab === 'contacts'">
          <d-contact
            v-for="user in users?.users?.edges"
            :key="user?.id"
            @click="createChatWithUser(user)"
            :firstname="user?.firstName"
            :lastname="user?.lastName"
          ></d-contact>
        </div>
      </div>
      <div class="pb-2 px-2 flex justify-center">
        <d-tabs class="w-full">
          <d-tab
            class="flex items-center gap-1 flex-1 justify-center"
            v-for="(sidebar, _) in sidebars"
            :key="_"
            :active="sidebar.id === tab"
            :to="`/chat/${sidebar.id}/${chat}`"
          >
            <component class="size-5" :is="sidebar.icon" />
            {{ sidebar.name }}
          </d-tab>
        </d-tabs>
      </div>
    </div>
    <div class="w-full flex-1">
      <div v-if="chat" class="w-full flex-1">
        <router-view></router-view>
      </div>
      <!-- show start state-->
      <div v-else class="w-full flex-1">
        <d-empty
          title="Chats"
          text="In chats you can communicate with the whole organization."
          :icon="MessageCircle"
          :center="false"
        >
          <template #actions>
            <d-button size="sm" type="outline" :icon-left="BookUser" @click="navigateToContacts">Contacts</d-button>
            <d-button size="sm" :icon-left="Plus" @click="createNewGroup">Create Group</d-button>
          </template>
        </d-empty>
      </div>
    </div>
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
import AppSwitcher2 from "@/components/AppSwitcher2.vue"
import DNewChat from "@/components/_chat/d-new-chat.vue"
import DInput from "@/components/d-input/d-input.vue"
import DTabs from "@/components/d-tabs/d-tabs.vue"
import DTab from "@/components/d-tabs/d-tab.vue"
import DChat from "@/components/_chat/d-chat.vue"
import DContact from "@/components/_chat/d-contact.vue"
import DEmpty from "@/components/d-empty/d-empty.vue"
import DButton from "@/components/d-button/d-button.vue"
import { MessageCircle, BookUser, Plus } from "lucide-vue-next"
import { useRouteParams } from "@vueuse/router"
import { useChatsQuery } from "@/gql/queries/chats/chats"
import { useChatUsersQuery } from "@/gql/queries/chats/chatUsers"
import { ref } from "vue"
import { useAddUserToChatMutation } from "@/gql/mutations/chats/addUserToChat"
import { useCreateChatMutation } from "@/gql/mutations/chats/createChat"
import { useRouter } from "vue-router/auto"

import type { User } from "@/gql/schema"

const tab = useRouteParams("tab", "chats")
const chat = useRouteParams("id", "")
const search = ref("")
const router = useRouter()

const sidebars = [
  { id: "chats", name: "Chats", icon: MessageCircle },
  { id: "contacts", name: "Contacts", icon: BookUser }
]

const { executeMutation: createChat } = useCreateChatMutation()
const { executeMutation: addUserToChatMut } = useAddUserToChatMutation()

async function createChatWithUser(user: User) {
  const createChatResult = await createChat({
    input: {
      name: user.firstName + " " + user.lastName
    }
  })
  if (!createChatResult.data?.createChat?.id) return
  const addUserResult = await addUserToChatMut({
    input: {
      chatId: createChatResult.data?.createChat?.id,
      userId: user.id
    }
  })
  if (!addUserResult.data?.addUserToChat?.chat?.id) return
  router.push({ name: "/chat/[tab]/[id]/", params: { tab: "chats", id: addUserResult.data?.addUserToChat?.chat?.id } })
}

async function createNewGroup() {
  const createResult = await createChat({
    input: {
      name: "New group"
    }
  })
  router.push("/chat/chats/" + createResult.data?.createChat.id)
}

function navigateToContacts() {
  router.push({ name: "/chat/[tab]", params: { tab: "contacts" } })
}

const { data: chatList } = useChatsQuery({})
const { data: users } = useChatUsersQuery({})
</script>

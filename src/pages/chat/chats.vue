<template>
  <div class="text-sm flex h-screen w-full">
    <div class="flex flex-col w-[300px] border-r h-full overflow-auto">
      <div class="p-2 w-full border-b h-16 items-center flex">
        <d-button class="w-full" @click="createNewChat">New chat</d-button>
      </div>
      <router-link
        :to="`/chat/chats/` + chat?.id"
        class="px-4 py-2.5 flex gap-4 items-center border-b"
        v-for="chat in chatList?.chats?.edges"
        :key="chat?.id"
        :class="chat?.id === route.params.id ? `bg-neutral-200` : ``"
      >
        <div
          class="h-12 w-12 rounded-full"
          :class="chat?.id === route.params.id ? `bg-neutral-300` : `bg-neutral-100`"
        ></div>
        <div class="flex-1 w-full">
          <div class="font-semibold mb-1">{{ chat?.name }}</div>
          <div class="text-neutral-500 text-xs line-clamp-2">
            {{ chat?.lastMessage?.message ? chat?.lastMessage?.message : `No messages yet` }}
          </div>
        </div>
      </router-link>
    </div>
    <div class="w-full flex-1">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router/auto";
import { useMutation, useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import DButton from "@/components/d-button/d-button.vue";

const route = useRoute("/chat/chats/[id]");

const { data: chatList } = useQuery({
  query: graphql(`
    query chats {
      chats {
        edges {
          id
          name
          lastMessage {
            id
            message
          }
        }
      }
    }
  `),
});

// mutation create new chat
const { executeMutation: createChat } = useMutation(
  graphql(`
    mutation createChat($input: CreateChatInput!) {
      createChat(input: $input) {
        id
        name
        createdAt
      }
    }
  `),
);

async function createNewChat() {
  await createChat({
    input: {
      name: "New chat",
    },
  });
}
</script>

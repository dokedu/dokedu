<template>
  <div class="text-sm flex h-screen w-full">
    <div class="flex flex-col w-[300px] border-r bg-neutral-100 h-full">
      <div class="px-2 pt-2">
        <app-switcher2 />
      </div>
      <div class="px-2 mb-1.5 pt-3 flex justify-between gap-1 items-center">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          class="border-none px-2.5 ring-0 focus:ring-0 focus:bg-neutral-300 py-1.5 text-sm bg-neutral-200 hover:bg-neutral-300 rounded-lg placeholder:text-neutral-400 w-full"
        />
        <d-new-chat />
      </div>
      <div class="flex px-4 border-b border-neutral-200 shadow-sm overflow-scroll no-scrollbar">
        <div
          class="hover:bg-blue-200/50 rounded-t-md text-xs px-4 text-blue-600 font-medium py-2 border-b-2 border-blue-500"
        >
          All
        </div>
        <div class="text-neutral-500 hover:bg-neutral-200 rounded-t-md text-xs px-4 py-2 font-medium">Friends</div>
        <div class="text-neutral-500 hover:bg-neutral-200 rounded-t-md text-xs px-4 py-2 font-medium">Family</div>
        <div class="text-neutral-500 hover:bg-neutral-200 rounded-t-md text-xs px-4 py-2 font-medium">Work</div>
      </div>
      <div class="flex flex-col overflow-scroll flex-1">
        <router-link
          :to="`/chat/chats/` + chat?.id"
          class="px-4 py-2.5 flex gap-4 items-center border-b border-neutral-900/5"
          v-for="chat in chatList?.chats?.edges"
          :key="chat?.id"
          :class="chat?.id === route.params.id ? `bg-neutral-900/10` : `hover:bg-neutral-900/5`"
        >
          <div class="h-12 w-12 rounded-full bg-neutral-900/10"></div>
          <div class="flex-1 w-full">
            <div class="font-semibold mb-1">{{ chat?.name }}</div>
            <div class="text-neutral-500 text-xs line-clamp-2 h-[2rem]">
              {{ chat?.lastMessage ? chat?.lastMessage : `No messages yet` }}
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="w-full flex-1">
      <router-view></router-view>
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
import { useRoute } from "vue-router/auto";
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import AppSwitcher2 from "@/components/AppSwitcher2.vue";
import DNewChat from "@/components/_chat/d-new-chat.vue";

const route = useRoute("/chat/chats/[id]/");

const { data: chatList } = useQuery({
  query: graphql(`
    query chats {
      chats {
        edges {
          id
          name
          lastMessage
        }
      }
    }
  `),
});
</script>

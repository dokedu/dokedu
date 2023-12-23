<template>
  <div class="flex flex-col h-screen w-full">
    <div class="px-4 border-b shadow-sm w-full grid grid-cols-3 h-16 justify-between items-center">
      <router-link :to="`/chat/chats/${route.params.id}/`">
        <d-button type="transparent" :icon-left="ChevronLeft">Back</d-button>
      </router-link>
      <router-link :to="`/chat/chats/${route.params.id}/edit`" class="font-semibold text-center flex-1">
        {{ data?.chat.name ? data?.chat.name : `Unnamed chat` }}
      </router-link>
      <div></div>
    </div>
    <div class="max-w-lg mx-auto w-full">
      <div class="p-4 flex justify-center gap-4">
        <d-button-add-chat-user :chat-id="route.params.id" />
        <d-button type="outline" @click="soon">Leave</d-button>
        <d-button type="outline" @click="soon">Delete</d-button>
      </div>
      <div class="p-4 divide-y">
        <div class="group p-2 flex justify-between items-center" v-for="user in data?.chat.users" :key="user.id">
          <div>
            <div class="mb-1">{{ user.firstName }} {{ user.lastName }}</div>
            <div class="text-neutral-500 text-xs min-h-[1rem]">{{ user.email ? user.email : user.id }}</div>
          </div>
          <d-button @click="soon" type="transparent" class="hidden group-hover:block text-red-500 hover:text-red-500">
            Remove
          </d-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router/auto";
import { computed, reactive } from "vue";
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import DButton from "@/components/d-button/d-button.vue";
import { ChevronLeft } from "lucide-vue-next";
import DButtonAddChatUser from "@/components/_chat/d-button-add-chat-user.vue";

const route = useRoute("/chat/chats/[id]/edit");

const id = computed(() => route.params.id);

const { data } = useQuery({
  query: graphql(`
    query chatWithMembers($id: ID!) {
      chat(id: $id) {
        id
        name
        users {
          id
          firstName
          lastName
          email
        }
      }
    }
  `),
  variables: reactive({
    id: id,
  }),
});

function soon() {
  alert("This feature is coming soon!");
}
</script>

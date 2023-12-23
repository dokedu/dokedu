<template>
  <div class="flex flex-col h-screen w-full">
    <router-link
      :to="`/chat/chats/${route.params.id}/edit`"
      class="px-4 border-b shadow-sm w-full grid grid-cols-3 h-16 justify-between items-center"
    >
      <div></div>
      <div class="font-semibold text-center">{{ data?.chat.name ? data?.chat.name : `Unnamed chat` }}</div>
      <div></div>
    </router-link>
    <div ref="messageContainer" class="h-full flex-1 overflow-auto">
      <div v-for="message in data?.chat.messages" class="p-4 w-full rounded-[inherit]" style="overflow: hidden scroll">
        <div class="space-y-4">
          <div
            class="flex items-start space-x-2 max-w-[80%]"
            :class="message.user.id === userData?.me?.id ? `justify-end ml-auto` : `justify-start`"
          >
            <div class="flex flex-col">
              <div class="text-sm text-neutral-500">{{ fullName(message.user) }}</div>
              <div
                class="bg-neutral-100 rounded-lg p-2 w-fit whitespace-pre-wrap"
                :class="message.user.id === userData?.me?.id ? `self-end` : `bg-neutral-100`"
              >
                <d-markdown :source="message.message"></d-markdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="data?.chat.messages.length === 0" class="h-full">
        <div class="text-center text-neutral-500 text-sm p-4 flex justify-center items-center h-full">
          No messages yet
        </div>
      </div>
    </div>
    <footer class="w-full px-2 pb-2">
      <textarea
        ref="textarea"
        v-model="input"
        type="text"
        placeholder="Write a message..."
        class="w-full resize-none block rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-950 text-sm leading-6"
        @keydown.enter.exact.prevent="onSubmit"
        @keydown.enter.shift.prevent="input += '\n'"
      />
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
import { useMutation, useQuery, useSubscription } from "@urql/vue";
import { graphql } from "@/gql";
import { useRoute } from "vue-router/auto";
import me from "@/queries/me.ts";
import { computed, nextTick, reactive, ref, watch } from "vue";
import DMarkdown from "@/components/d-markdown/d-markdown.vue";
import { useTextareaAutosize } from "@vueuse/core";

const route = useRoute("/chat/chats/[id]/");

const id = computed(() => route.params.id);
const messageContainer = ref<HTMLElement>();

const { textarea, input } = useTextareaAutosize();

const { data, executeQuery: refresh } = useQuery({
  query: graphql(`
    query chat($id: ID!) {
      chat(id: $id) {
        id
        name
        messages {
          id
          message
          user {
            id
            firstName
            lastName
          }
          createdAt
        }
      }
    }
  `),
  variables: reactive({
    id: id,
  }),
});

const { data: userData } = useQuery({
  query: me,
});

function fullName(user: { firstName: string; lastName: string }) {
  return `${user.firstName} ${user.lastName}`;
}

const { executeMutation: sendMessageMutation } = useMutation(
  graphql(`
    mutation sendMessage($input: SendMessageInput!) {
      sendMessage(input: $input) {
        id
        chat {
          id
        }
      }
    }
  `),
);

async function onSubmit() {
  await sendMessage(input.value.replace(/^\s+|\s+$/g, ""));
  input.value = "";
}

async function sendMessage(message: string) {
  if (!message) return;
  if (message.length === 0) return;
  await sendMessageMutation({
    input: {
      chatId: id.value,
      message: message,
    },
  });
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
}

async function handleSubscription() {
  await refresh();
}

useSubscription(
  {
    query: graphql(`
      subscription messageAdded($chatId: ID!) {
        messageAdded(chatId: $chatId) {
          id
          chat {
            id
            lastMessage
          }
          user {
            id
            firstName
            lastName
          }
          message
        }
      }
    `),
    variables: reactive({
      chatId: id,
    }),
    // pause: !id.value,
  },
  handleSubscription,
);

watch(
  [data],
  () => {
    nextTick(() => {
      scrollToBottomConditionally();
    });
  },
  {
    flush: "post",
  },
);

function scrollToBottomConditionally() {
  if (messageContainer.value) {
    // only scroll if the user is close to the bottom of the chat
    if (
      messageContainer.value.scrollTop + messageContainer.value.clientHeight + 100 >=
      messageContainer.value.scrollHeight
    ) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  }
}

watch(
  [id],
  () => {
    nextTick(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
      }
    });
  },
  {
    flush: "post",
  },
);
</script>

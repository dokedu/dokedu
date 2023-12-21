<template>
  <div class="flex flex-col h-screen w-full">
    <header class="p-4 border-b font-semibold h-16 flex justify-center items-center">
      <div>{{ data?.chat.name }}</div>
    </header>
    <div ref="messageContainer" class="h-full flex-1 overflow-auto">
      <div v-for="message in data?.chat.messages" class="p-4 w-full rounded-[inherit]" style="overflow: hidden scroll">
        <div class="space-y-4">
          <div
            class="flex items-start space-x-2 max-w-[80%]"
            :class="message.user.id === userData?.me?.id ? `justify-end ml-auto` : `justify-start`"
          >
            <div
              v-if="message.user.id !== userData?.me?.id"
              class="relative bg-neutral-200 flex h-10 w-10 shrink-0 overflow-hidden rounded-full"
            />
            <div class="flex flex-col">
              <div class="text-sm text-neutral-500">{{ fullName(message.user) }}</div>
              <div
                class="bg-neutral-200 rounded-lg p-2 w-fit whitespace-pre-wrap"
                :class="message.user.id === userData?.me?.id ? `self-end` : `bg-neutral-200`"
              >
                <d-markdown :source="message.message"></d-markdown>
              </div>
            </div>
            <div
              v-if="message.user.id === userData?.me?.id"
              class="relative bg-neutral-200 flex h-10 w-10 shrink-0 overflow-hidden rounded-full"
            />
          </div>
        </div>
      </div>
      <div v-if="data?.chat.messages.length === 0" class="h-full">
        <div class="text-center text-neutral-500 text-sm p-4 flex justify-center items-center h-full">
          No messages yet
        </div>
      </div>
    </div>
    <footer class="w-full border-t">
      <textarea
        ref="textarea"
        v-model="input"
        type="text"
        placeholder="Type your message here..."
        class="w-full border-0 text-sm p-4 placeholder:text-neutral-500 ring-0 focus:ring-0"
        @keydown.enter.exact.prevent="onSubmit"
        @keydown.enter.shift.prevent="input += '\n'"
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery, useSubscription } from "@urql/vue";
import { graphql } from "@/gql";
import { useRoute } from "vue-router/auto";
import me from "@/queries/me.ts";
import { computed, nextTick, reactive, ref, watch } from "vue";
import DMarkdown from "@/components/d-markdown/d-markdown.vue";
import { useTextareaAutosize } from "@vueuse/core";

const route = useRoute("/chat/chats/[id]");

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
  await sendMessage(input.value);
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
            lastMessage {
              id
              message
            }
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
  data,
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

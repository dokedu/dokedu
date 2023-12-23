<template>
  <div class="text-neutral-600 p-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-md" @click="createNewChat">
    <PenSquare :size="20" />
  </div>
</template>

<script lang="ts" setup>
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { PenSquare } from "lucide-vue-next";

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

<template>
  <div class="text-neutral-600 p-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-md" @click="createNewChat">
    <PenSquare :size="20" />
  </div>
</template>

<script lang="ts" setup>
import { PenSquare } from "lucide-vue-next"
import { useCreateChatMutation } from "@/gql/mutations/chats/createChat"

const { executeMutation: createChat } = useCreateChatMutation()

async function createNewChat() {
  await createChat({
    input: {
      name: "New chat"
    }
  })
}
</script>

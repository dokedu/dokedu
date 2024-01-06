<template>
  <d-icon-button :icon="PenSquare" size="lg" @click="createNewChat"></d-icon-button>
</template>

<script lang="ts" setup>
import { PenSquare } from "lucide-vue-next"
import { useCreateChatMutation } from "@/gql/mutations/chats/createChat"
import DIconButton from "@/components/d-icon-button/d-icon-button.vue"

const { executeMutation: createChat } = useCreateChatMutation()

async function createNewChat() {
  await createChat({
    input: {
      name: "New chat"
    }
  })
}
</script>

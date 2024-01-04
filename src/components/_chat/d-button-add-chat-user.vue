<template>
  <div>
    <d-button type="outline" @click="modalOpen = true">Add</d-button>
    <d-dialog :open="modalOpen" @close="modalOpen = false" title="Add user to chat">
      <template #main>
        <div class="max-h-[50vh] flex flex-col">
          <input
            v-model="search"
            class="px-2 py-1.5 rounded-md border-none bg-neutral-100 text-sm mb-2 focus:ring-2 ring-blue-500"
            type="text"
            name="search"
            placeholder="Search"
          />
          <div class="overflow-scroll p-1 flex flex-col flex-1">
            <button
              type="button"
              class="p-2 hover:bg-neutral-100 text-start rounded-md focus:ring-2 ring-blue-500"
              v-for="user in users as User[]"
              :key="user.id"
              @click="addUserToChat(user.id)"
            >
              {{ user.firstName }} {{ user.lastName }}
            </button>
          </div>
        </div>
      </template>
    </d-dialog>
  </div>
</template>

<script lang="ts" setup>
import DButton from "@/components/d-button/d-button.vue";
import DDialog from "@/components/d-dialog/d-dialog.vue";
import { computed, ref } from "vue";
import { useAddUserToChatMutation } from "@/gql/mutations/chats/addUserToChat.ts";
import { useUserListQuery } from "@/gql/queries/users/userList.ts";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const props = defineProps<{
  chatId: string;
}>();

const modalOpen = ref(false);
const search = ref("");

const { data } = useUserListQuery({
  variables: {
    search: search.value,
  },
});

const users = computed(() => data?.value?.users.edges ?? []);

const { executeMutation: addUserToChatMut } = useAddUserToChatMutation();

async function addUserToChat(userId: string) {
  await addUserToChatMut({
    input: {
      chatId: props.chatId,
      userId: userId,
    },
  });
  modalOpen.value = false;
}
</script>

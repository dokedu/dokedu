<template>
  <div class="relative" ref="popover">
    <d-icon-button
      :icon="PenSquare"
      size="md"
      @click="popoverOpen = !popoverOpen"
      :type="popoverOpen ? 'primary' : 'outline'"
    ></d-icon-button>
    <Transition name="popover">
      <d-popover v-if="popoverOpen" class="top-[calc(100%+4px)]">
        <d-popover-item @click="createNewGroup">
          <UsersRound class="size-5" />
          <span>{{ $t("new_group") }}</span>
        </d-popover-item>
        <d-popover-item v-if="false">
          <Megaphone class="size-5" />
          <span>{{ $t("new_channel") }}</span>
        </d-popover-item>
        <d-popover-item @click="navigateToContacts">
          <BookUser class="size-5" />
          <span>{{ $t("contacts") }}</span>
        </d-popover-item>
      </d-popover>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { PenSquare, UsersRound, Megaphone, BookUser } from "lucide-vue-next"
import { useCreateChatMutation } from "@/gql/mutations/chats/createChat"
import DIconButton from "@/components/d-icon-button/d-icon-button.vue"
import DPopover from "@/components/d-popover/d-popover.vue"
import DPopoverItem from "@/components/d-popover/d-popover-item.vue"
import { ref } from "vue"
import { useRouteParams } from "@vueuse/router"
import router from "@/router/router"
import { onClickOutside } from "@vueuse/core"

const { executeMutation: createChat } = useCreateChatMutation()
const popoverOpen = ref(false)

const chat = useRouteParams("id", "")
const popover = ref(null)

function navigateToContacts() {
  popoverOpen.value = false

  router.push({ name: "/chat/[tab]/[id]/", params: { tab: "contacts", id: chat.value } })
}

async function createNewGroup() {
  const createResult = await createChat({
    input: {
      name: "New group"
    }
  })
  popoverOpen.value = false
  router.push("/chat/chats/" + createResult.data?.createChat.id)
}

onClickOutside(popover, () => {
  popoverOpen.value = false
})
</script>

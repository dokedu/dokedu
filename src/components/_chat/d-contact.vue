<template>
  <div class="px-2">
    <div class="p-2 hover:bg-black/5 flex items-center gap-2.5 rounded-xl">
      <d-avatar :initials="getInitials()" :icon="UserRound" />
      <div class="flex-1 w-full">
        <div class="font-semibold">{{ firstname }} {{ lastname }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserRound } from "lucide-vue-next"
import DAvatar from "@/components/d-avatar/d-avatar.vue"

type Props = {
  firstname: string
  lastname: string
}

const props = defineProps<Props>()

function getInitials() {
  return (props.firstname ? props.firstname[0] : "") + (props.lastname ? props.lastname[0] : "")
}
</script>

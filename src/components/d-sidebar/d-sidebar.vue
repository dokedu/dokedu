<template>
  <div
    ref="sidebar"
    class="absolute right-0 top-0 h-screen w-full max-w-xl overflow-scroll bg-white p-4 shadow-md shadow-stone-300"
  >
    <div class="mb-4 flex justify-between">
      <div class="select-none text-sm font-medium text-strong">{{ title }}</div>
      <d-button v-if="delete" type="transparent" size="xs" :icon-left="Trash" @click="onTrash">{{
        $t("delete")
      }}</d-button>
    </div>

    <div class="mb-4 flex flex-col gap-2">
      <slot name="main"></slot>
    </div>
    <div class="flex justify-between">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Trash } from "lucide-vue-next";
import { ref } from "vue";
import { onClickOutside, onKeyStroke } from "@vueuse/core";
import DButton from "../d-button/d-button.vue";

const sidebar = ref<HTMLElement | null>(null);

defineProps({
  title: {
    type: String,
    default: "title",
  },
  delete: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["delete", "cancel"]);
function cancel() {
  emit("cancel");
}

onClickOutside(sidebar, async () => {
  cancel();
});

onKeyStroke("Escape", async () => {
  cancel();
});

const onTrash = () => {
  emit("delete");
};
</script>

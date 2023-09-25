<template>
  <div
    ref="sidebar"
    class="absolute right-0 top-0 h-screen w-full max-w-xl overflow-scroll bg-white p-4 shadow-md shadow-neutral-300"
  >
    <div class="mb-4 flex flex-wrap justify-between gap-2">
      <slot name="header">
        <div class="select-none text-sm font-medium text-strong">{{ title }}</div>
        <d-button v-if="deletable" type="transparent" size="xs" :icon-left="Trash" @click="onTrash">
          {{ $t("delete") }}
        </d-button>
      </slot>
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
import { ref, toRef } from "vue";
import { onClickOutside, onKeyStroke } from "@vueuse/core";
import DButton from "../d-button/d-button.vue";

const sidebar = ref<HTMLElement | null>(null);

const props = defineProps({
  title: {
    type: String,
    default: "title",
  },
  delete: {
    type: Boolean,
    default: false,
  },
});

const deletable = toRef(props, "delete");

const emit = defineEmits(["delete", "cancel"]);
function cancel() {
  emit("cancel");
}

function onTrash() {
  emit("delete");
}

onClickOutside(sidebar, () => cancel());
onKeyStroke("Escape", () => cancel());
</script>

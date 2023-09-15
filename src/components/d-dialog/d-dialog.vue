<template>
  <DialogRoot v-model:open="modalOpen">
    <slot name="trigger" />
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-20 bg-stone-950/50" />
      <DialogContent
        class="fixed left-1/2 top-1/2 z-20 flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col gap-4 rounded-md bg-white p-6 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <div class="flex w-full items-center justify-between">
          <DialogTitle class="w-fit text-sm"> {{ title }} </DialogTitle>
          <DialogClose @click="onClose"
            class="rounded-md p-1 hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950">
            <X :size="18" />
          </DialogClose>
        </div>
        <DialogDescription class="text-sm">
          <slot name="main" />
        </DialogDescription>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "radix-vue";

import { X } from "lucide-vue-next";
import { ref, watch } from "vue";

interface Props {
  title: string;
  open?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close"]);
const modalOpen = ref(props.open);

watch(
  () => props.open,
  () => {
    modalOpen.value = props.open;
  }
);

const onClose = () => {
  modalOpen.value = false;
  emit("close");
};
</script>
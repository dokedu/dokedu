<template>
  <dialog ref="dialog" class="overflow-visible rounded-lg backdrop:bg-stone-900/90" @close="close">
    <header class="mb-4 text-sm font-medium">
      <slot name="header"></slot>
    </header>
    <slot name="main"></slot>
    <footer class="mt-3">
      <slot name="footer"></slot>
    </footer>
  </dialog>
</template>

<script lang="ts" setup>
import { ref, toRef, watch } from "vue";

const dialog = ref<HTMLDialogElement | null>(null);

export interface Props {
  open: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emit = defineEmits(["close"]);

const open = toRef(props, "open");

watch(open, (value) => {
  if (value) {
    dialog.value?.showModal();
  } else {
    emit("close");
    dialog.value?.close();
  }
});

function close(e: Event | undefined) {
  if (e) {
    e.preventDefault();
  }
  emit("close");
  dialog.value?.close();
}
</script>

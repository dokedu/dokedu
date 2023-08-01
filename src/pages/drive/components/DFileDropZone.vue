<template>
  <div
    class="relative flex h-full flex-col transition-all"
    @drop.prevent="dropHandler"
    @dragenter="hasDragover = true"
    @dragover="hasDragover = true"
    @dragexit="hasDragover = false"
    @dragend="hasDragover = false"
  >
    <slot />
    <div v-show="hasDragover" class="absolute left-0 top-0 h-full w-full rounded-xl p-1">
      <div class="h-full w-full rounded-xl border-2 border-black bg-stone-950/10"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";

const hasDragover = ref(false);

const emit = defineEmits(["upload"]);

const events = ["dragenter", "dragover", "dragleave", "drop"];

async function dropHandler(event: any) {
  console.log(event);
  if (event.dataTransfer) {
    if (event.dataTransfer.files.length > 0) {
      emit("upload", {
        files: event.dataTransfer.files,
      });

      hasDragover.value = false;
    }
  }
}

function preventDefaults(e: any) {
  e.preventDefault();
}

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults);
  });
});

onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, preventDefaults);
  });
});
</script>

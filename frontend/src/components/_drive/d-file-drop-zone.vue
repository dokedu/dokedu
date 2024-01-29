<template>
  <div data-name="d-file-drop-zone" class="relative flex h-full flex-col transition-all" ref="dropzone">
    <slot />
    <div v-show="hasDragover" class="absolute left-0 top-0 h-full w-full rounded-xl p-1">
      <div class="h-full w-full rounded-xl border-2 border-neutral-950 bg-neutral-950/10"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEventListener } from "@vueuse/core"
import { ref } from "vue"

const hasDragover = ref(false)

const emit = defineEmits(["upload"])

const dropzone = ref<HTMLElement | null>(null)

useEventListener(dropzone, "dragenter", (event: DragEvent) => {
  const types = event.dataTransfer?.types || []

  if (types.includes("dokedu/vnd.dokedu-drive-file")) {
    hasDragover.value = false
    return false
  }

  hasDragover.value = true

  event.preventDefault()
})

useEventListener(dropzone, "dragend", (event: DragEvent) => {
  hasDragover.value = false

  event.preventDefault()
})

useEventListener(dropzone, "dragover", (event: DragEvent) => {
  const types = event.dataTransfer?.types || []

  if (types.includes("dokedu/vnd.dokedu-drive-file")) {
    hasDragover.value = false
    return false
  }

  hasDragover.value = true

  event.preventDefault()
})

// useEventListener(dropzone, "dragend", () => {});

useEventListener(dropzone, "drop", (event: DragEvent) => {
  event.preventDefault()

  const types = event.dataTransfer?.types || []

  if (types.includes("dokedu/vnd.dokedu-drive-file")) {
    hasDragover.value = false
    return false
  }

  if (event.dataTransfer) {
    if (event.dataTransfer.files.length > 0) {
      emit("upload", {
        files: event.dataTransfer.files
      })

      hasDragover.value = false
    }
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      class="absolute left-0 top-0 h-screen w-screen select-none overflow-hidden"
      style="height: -webkit-fill-available"
    >
      <div id="sheet" class="absolute left-0 flex h-screen w-full flex-col overflow-hidden rounded-t-lg bg-white">
        <div class="flex w-full justify-center">
          <div ref="handle" class="p-4 w-full flex justify-center">
            <div class="h-1 w-36 rounded-lg bg-neutral-900/50"></div>
          </div>
        </div>
        <button @click="close" class="absolute right-2 top-2 rounded-full bg-neutral-100 p-1" type="button">
          <X class="text-neutral-500" :size="18" />
        </button>
        <div>
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { executeTransition, useEventListener, useMouse } from "@vueuse/core"
import { X } from "lucide-vue-next"

const MIN_HEIGHT = 32
const MAX_HEIGHT = window.innerHeight
const THRESHOLD = Math.round(MAX_HEIGHT * 0.3)

const handle = ref()
const opening = ref(true)
const dragging = ref(false)
const animating = ref(false)
const sheetHeight = ref<number>(MAX_HEIGHT)

const sheetHeightPx = computed(() => sheetHeight.value + "px")

const emit = defineEmits(["close"])

async function close() {
  dragging.value = false
  await animate(MAX_HEIGHT)
  emit("close")
}

async function animate(to: number) {
  if (animating.value) return
  animating.value = true

  await executeTransition(sheetHeight, sheetHeight, to, {
    duration: (Math.abs(sheetHeight.value - to) / (MAX_HEIGHT - MIN_HEIGHT)) * 300
  })

  animating.value = false
}

async function resize(y: number) {
  if (sheetHeight) if (MIN_HEIGHT > y) return

  if (dragging.value) {
    sheetHeight.value = y - 5
  } else {
    if (sheetHeight.value === MIN_HEIGHT) return
    if (sheetHeight.value === MAX_HEIGHT) return

    if (y > THRESHOLD) {
      await close()
    } else {
      await animate(MIN_HEIGHT)
    }
  }
}

onMounted(async () => {
  window.scrollTo(0, 1)

  await animate(MIN_HEIGHT)
  opening.value = false

  if (!handle.value) return
})

onUnmounted(() => close)

useEventListener(handle, ["mousedown", "touchstart"], () => {
  dragging.value = true
})

useEventListener(window, ["mouseup", "touchend"], () => {
  dragging.value = false
  resize(y.value)
})

const { y } = useMouse()

watch(y, async () => {
  if (opening.value) return
  resize(y.value)
})
</script>

<style>
#sheet {
  position: absolute;
  top: v-bind(sheetHeightPx);
}
</style>

<template>
  <div
    class="rounded-xl p-2 flex gap-2 text-sm overflow-hidden border border-deafault"
    :class="subtitle ? '' : 'items-center'"
  >
    <div class="size-7 min-w-7 justify-center items-center flex rounded-full" :class="`bg-${colors[type]}-100`">
      <component :is="icon ? icon : icons[type]" class="size-4" :class="`text-${colors[type]}-700`"></component>
    </div>
    <div class="">
      <div class="font-medium">{{ title }}</div>
      <div class="text-subtle">{{ subtitle }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type Icon } from "@/types/types"
import { AlertOctagon, CheckCircle, Info, AlertTriangle } from "lucide-vue-next"

type Props = {
  icon?: Icon
  type: "error" | "success" | "warning" | "info"
  title: string
  subtitle?: string
}

const colors = {
  error: "red",
  success: "green",
  warning: "yellow",
  info: "blue"
}

const icons = {
  error: AlertOctagon,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info
}

// bg-red-100      text-red-700      border-red-700        bg-red-700
// bg-green-100    text-green-700    border-green-700      bg-green-700
// bg-yellow-100   text-yellow-700   border-yellow-700     bg-yellow-700
// bg-blue-100     text-blue-700     border-blue-700       bg-blue-700

withDefaults(defineProps<Props>(), {
  type: "info"
})
</script>

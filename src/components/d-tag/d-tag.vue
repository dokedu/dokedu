<template>
  <div
    class="flex w-max select-none items-center rounded-full px-2.5 py-1 text-sm"
    :class="`bg-${color}-50 text-${color}-700`"
  >
    <div class="flex items-center justify-between gap-2">
      <p class="line-clamp-1 flex items-center gap-1">
        <slot />
      </p>
      <X
        class="h-5 w-5 shrink-0 rounded-full p-0.5"
        :size="16"
        :class="`hover:bg-${color}-100`"
        v-if="removable"
        @click="remove"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { X } from "lucide-vue-next"
// colors
// bg-blue-50    text-blue-700    !text-blue-700    border-blue-200    stroke-blue-500     hover:bg-blue-100
// bg-red-50     text-red-700     !text-red-700     border-red-200     stroke-red-500      hover:bg-red-100
// bg-orange-50  text-orange-700  !text-orange-700  border-orange-200  stroke-orange-500   hover:bg-orange-100
// bg-purple-50  text-purple-700  !text-purple-700  border-purple-200  stroke-purple-500   hover:bg-purple-100
// bg-green-50   text-green-700   !text-green-700   border-green-200   stroke-green-500    hover:bg-green-100
// bg-yellow-50  text-yellow-700  !text-yellow-700  border-yellow-200  stroke-yellow-500   hover:bg-yellow-100
// bg-indigo-50  text-indigo-700  !text-indigo-700  border-indigo-200  stroke-indigo-500   hover:bg-indigo-100
// bg-pink-50    text-pink-700    !text-pink-700    border-pink-200    stroke-pink-500     hover:bg-pink-100
// bg-gray-50    text-gray-700    !text-gray-700    border-gray-200    stroke-gray-500     hover:bg-gray-100
// bg-neutral-50    text-neutral-700    !text-neutral-700    border-neutral-200    stroke-neutral-500     hover:bg-neutral-100

const props = defineProps({
  color: {
    type: String,
    default: "blue"
  },
  id: {
    type: String,
    default: ""
  },
  removable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["remove"])

const remove = () => {
  emit("remove", props.id)
}
</script>

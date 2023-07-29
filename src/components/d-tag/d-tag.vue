<template>
  <div
    class="flex w-fit select-none items-center rounded-full px-2.5 py-1 text-sm"
    :class="`bg-${color}-50 text-${color}-700`"
  >
    <div class="flex items-center justify-between gap-2">
      <p class="line-clamp-1">
        <slot />
      </p>
      <X class="h-4 w-4 shrink-0" v-if="removable" @click="remove"></X>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { X } from "lucide-vue-next";
// colors
// bg-blue-50    text-blue-700    !text-blue-700
// bg-red-50     text-red-700     !text-red-700
// bg-orange-50  text-orange-700  !text-orange-700
// bg-purple-50  text-purple-700  !text-purple-700
// bg-green-50   text-green-700   !text-green-700
// bg-yellow-50  text-yellow-700  !text-yellow-700
// bg-indigo-50  text-indigo-700  !text-indigo-700
// bg-pink-50    text-pink-700    !text-pink-700
// bg-gray-50    text-gray-700    !text-gray-700

const props = defineProps({
  color: {
    type: String,
    default: "blue",
  },
  id: {
    type: String,
    default: "",
  },
  removable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["remove"]);

const remove = () => {
  emit("remove", props.id);
};
</script>

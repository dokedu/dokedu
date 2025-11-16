<script setup lang="ts">
interface Props {
  disabled?: boolean
}

const { disabled = false } = defineProps<Props>()
const model = defineModel<boolean>()

function toggle() {
  if (!disabled) {
    model.value = !model.value
  }
}
</script>

<template>
  <div class="flex items-center gap-3" :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'" @click="toggle">
    <button
      type="button"
      role="switch"
      :aria-checked="model"
      :disabled="disabled"
      tabindex="0"
      class="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent ring-blue-600 ring-offset-2 transition-colors duration-200 ease-in-out outline-none focus:ring-2"
      :class="[model ? 'bg-blue-600' : 'bg-neutral-200', disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
    >
      <span
        aria-hidden="true"
        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        :class="model ? 'translate-x-5' : 'translate-x-0'"
      />
    </button>
    <div v-if="$slots.default" class="text-sm font-medium text-neutral-500">
      <slot></slot>
    </div>
  </div>
</template>

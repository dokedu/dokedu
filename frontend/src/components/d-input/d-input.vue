<template>
  <div class="flex flex-col">
    <label v-if="label" class="mb-1 text-xs text-neutral-500" :for="name">{{ label }}</label>
    <input
      :value="modelValue"
      :type="type"
      :name="name"
      @input="onInput"
      :id="name"
      :max="max"
      :min="min"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete"
      class="block w-full leading-none rounded-lg shadow-sm border border-default text-sm focus:border-transparent focus:ring-offset-0 focus:ring-blue-500 focus:ring-2 text-neutral-900 outline-none placeholder:text-neutral-400 focus:shadow-sm sm:text-sm"
      :class="[{ '!cursor-not-allowed bg-neutral-50 opacity-75': disabled }, sizes[size]]"
    />
    <span class="text-xs mt-1" :class="messageColors[messageColor]" v-if="message">{{ message }}</span>
  </div>
</template>

<script lang="ts" setup>
type Props = {
  modelValue: string | number | Date | undefined
  label?: string
  type?: "text" | "email" | "password" | "number" | "date" | "time"
  name: string
  max?: number
  min?: number
  message?: string
  messageColor?: "default" | "success" | "warning" | "error" | "info"
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autocomplete?: string
  size?: "sm" | "md" | "lg"
}

withDefaults(defineProps<Props>(), {
  label: "",
  type: "text",
  placeholder: "",
  required: false,
  disabled: false,
  autocomplete: "off",
  size: "md",
  messageColor: "default"
})

const sizes = {
  sm: "py-1",
  md: "py-1.5",
  lg: "py-2"
}

const messageColors = {
  default: "text-subtle",
  success: "text-green-700",
  warning: "text-orange-700",
  error: "text-red-700",
  info: "text-blue-700"
}

const emit = defineEmits(["update:modelValue"])

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value)
}
</script>

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
      class="block w-full rounded-lg border border-default text-sm leading-none text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-strong focus:shadow-sm focus:ring-0 sm:text-sm"
      :class="[{ '!cursor-not-allowed bg-neutral-50 opacity-75': disabled }, sizes[size]]"
    />
  </div>
</template>

<script lang="ts" setup>
type Props = {
  modelValue: string | number | Date
  label?: string
  type: "text" | "email" | "password" | "number" | "date" | "time"
  name: string
  max?: number
  min?: number
  placeholder?: string
  required: boolean
  disabled: boolean
  autocomplete: string
  size: "sm" | "md" | "lg"
}

withDefaults(defineProps<Props>(), {
  label: "",
  type: "text",
  placeholder: "",
  required: false,
  disabled: false,
  autocomplete: "off",
  size: "md"
})

const sizes = {
  sm: "py-[4px]",
  md: "py-[6px]",
  lg: "py-[8px]"
}

const emit = defineEmits(["update:modelValue"])

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value)
}
</script>

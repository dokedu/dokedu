<template>
  <div class="flex flex-col">
    <label v-if="label" class="mb-1 text-sm text-neutral-500" :for="name">{{ label }}</label>
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
      class="block w-full rounded-lg border border-default py-[6px] text-sm leading-none text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-strong focus:shadow-sm focus:ring-0 sm:text-sm"
      :class="[{ '!cursor-not-allowed bg-neutral-50 opacity-75': disabled }]"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  modelValue: {
    type: [String, Number, Date],
    required: true
  },
  label: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    default: "text"
  },
  name: {
    type: String,
    required: true
  },
  max: {
    type: Number,
    default: null
  },
  min: {
    type: Number,
    default: null
  },
  placeholder: {
    type: String,
    default: ""
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["update:modelValue"])

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value)
}
</script>

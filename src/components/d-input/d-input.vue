<template>
  <div class="flex flex-col">
    <label v-if="label" class="mb-1 text-sm text-stone-500" :for="name">{{ label }}</label>
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
      class="block w-full rounded-md border-0 py-2.5 text-sm leading-none text-stone-900 shadow-sm ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm"
      :class="[{ 'bg-stone-50': disabled }]"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  modelValue: {
    type: [String, Number, Date],
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  name: {
    type: String,
    required: true,
  },
  max: {
    type: Number,
    default: null,
  },
  min: {
    type: Number,
    default: null,
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

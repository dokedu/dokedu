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
      class="rounded-md border border-stone-200 text-sm shadow"
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
});

const emit = defineEmits(["update:modelValue"]);

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

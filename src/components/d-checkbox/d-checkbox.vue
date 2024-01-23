<script setup lang="ts">
import { defineModel } from "vue"
import { CheckboxIndicator, CheckboxRoot } from "radix-vue"
import { CheckIcon } from "lucide-vue-next"

const model = defineModel({ type: Boolean })
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <label class="flex flex-row gap-2 items-center [&>.checkbox]:hover:bg-neutral-100">
      <CheckboxRoot
        v-model:checked="model"
        class="hover:bg-neutral-100 flex h-6 w-6 appearance-none items-center border border-neutral-300 justify-center rounded-md bg-white outline-none"
      >
        <CheckboxIndicator class="bg-white h-full w-full rounded flex items-center justify-center">
          <CheckIcon :size="16" class="text-black" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <span class="select-none text-sm text-neutral-700">
        <slot />
      </span>
    </label>
  </div>
</template>

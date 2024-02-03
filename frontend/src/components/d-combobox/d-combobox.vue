<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxLabel, ComboboxRoot, ComboboxSeparator, ComboboxTrigger, ComboboxViewport } from 'radix-vue'
import { ChevronDown, Check } from 'lucide-vue-next'

type Option = {
  label: string
  value: string
}

interface Props {
  options: Option[]
  modelValue: string | string[]
  multiple?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const v = ref(props.modelValue)

const onSelect = () => {
  if (props.multiple) {
    emit('update:modelValue', v.value.map((el: any) => el.value))
    return
  }

  emit('update:modelValue', v.value.value)
}
</script>

<template>
  <ComboboxRoot v-model="v" class="relative" :multiple="props.multiple">
    <ComboboxAnchor
      class="min-w-[160px] w-full hover:bg-stone-100 transition-all ease-in-out inline-flex rounded-lg border border-neutral-300 items-center justify-between rounded px-2.5 text-sm leading-none h-[36px] gap-[5px] bg-white text-grass11 outline-none">
      <ComboboxInput class="!bg-transparent focus:ring-0 w-full border-0 p-0 focus:outline-none h-full text-sm"
        placeholder="Placeholder..." />
      <ComboboxTrigger>
        <ChevronDown class="h-4 w-4 text-grass11" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent
      class="absolute z-10 w-full mt-2 min-w-[160px] bg-white overflow-hidden rounded border border-stone-300 rounded-md shadow will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade">
      <ComboboxViewport class="p-[5px]">
        <ComboboxEmpty class="text-mauve8 text-xs font-medium text-center py-2" />
        <ComboboxItem v-for="(option, index) in props.options" :key="index" @select="onSelect"
          class="rounded-md flex items-center rounded-md px-1.5 py-1 relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-stone-100"
          :value="option">
          <ComboboxItemIndicator class="absolute right-0 w-[25px] inline-flex items-center justify-center">
            <Check class="h-4 w-4" />
          </ComboboxItemIndicator>
          <span class="px-0.5 py-0.5 text-sm text-default truncate">
            {{ multiple ? option.label : option }}
          </span>
        </ComboboxItem>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
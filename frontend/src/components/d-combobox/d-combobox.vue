<script setup lang="ts">
import { computed } from 'vue'
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxPortal, ComboboxInput, ComboboxItem, ComboboxRoot, ComboboxTrigger, ComboboxViewport } from 'radix-vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import i18n from '@/i18n'

export type Option = {
  label: string
  value: string
}

interface Props {
  options: Option[]
  multiple: boolean
  placeholder: string
}

const props = defineProps<Props>()
const v = defineModel<Option | Option[]>()

const onSelect = (option: CustomEvent) => {
  if (props.multiple) {
    if (Array.isArray(v.value)) {
      const index = v.value.findIndex((el) => el.value === option.detail.value.value)
      if (index === -1) {
        v.value = [...v.value, option.detail.value]
      } else {
        v.value = v.value.filter((el) => el.value !== option.detail.value.value)
      }
    } else {
      v.value = [option.detail.value]
    }
  } else {
    v.value = option.detail.value
  }
}

const filterFunction = (list: Option[], search: string) => {
  return list.filter((el) => el.label.toLowerCase().includes(search.toLowerCase()))
}

const displayedLabel = computed(() => {
  if (!v.value) return props.placeholder

  if (props.multiple && Array.isArray(v.value)) {
    if (v.value.length === 0) return props.placeholder
    return v.value.length + ' ' + i18n.global.t('selected')
  }

  const option = props.options.find((option) => option.value === (v.value as Option).value)
  return option?.label
})

</script>

<template>
  <ComboboxRoot :filter-function="filterFunction" v-model="v" class="relative" :multiple="props.multiple">
    <ComboboxAnchor
      class="min-w-[160px] w-full hover:bg-stone-100 transition-all shadow-sm ease-in-out inline-flex rounded-lg border border-neutral-300 items-center justify-between rounded px-2.5 text-sm leading-none h-[36px] gap-[5px] bg-white text-grass11 outline-none">
      <ComboboxInput
        class="!bg-transparent focus:ring-0 w-full border-0 p-0 focus:outline-none h-full text-sm placeholder-neutral-700"
        :placeholder="displayedLabel" />
      <ComboboxTrigger>
        <ChevronDown class="h-4 w-4 text-grass11" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent
      class="combobox-content absolute z-10 w-full mt-2 min-w-[160px] bg-white overflow-hidden rounded border border-stone-300 rounded-md shadow">
      <ComboboxViewport class="p-[5px]">
        <ComboboxEmpty class="text-mauve8 text-xs font-medium text-center py-2">{{ $t("no_results") }}</ComboboxEmpty>
        <ComboboxItem v-for="option in props.options" :key="option.value" @select="onSelect"
          class="rounded-md flex max-w-full justify-between items-center rounded-md px-1.5 py-1 relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-stone-100"
          :value="option">
          <span class="px-0.5 py-0.5 text-sm text-default truncate">
            {{ option.label }}
          </span>
          <div
            v-if="multiple ? (v as Option[]).find(e => e.value === option.value) : (v as Option).value === option.value"
            class="w-[25px] shrink-0 inline-flex items-center justify-center">
            <Check class="h-4 w-4" />
          </div>
        </ComboboxItem>
      </ComboboxViewport>
    </ComboboxContent>

  </ComboboxRoot>
</template>
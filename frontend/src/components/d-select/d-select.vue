<template>
  <div class="relative select-none" ref="select" v-bind="$attrs" @focusin="open = true">
    <div class="min-w-[120px] items-center rounded-lg border border-neutral-300 shadow-sm focus:!outline-none"
      :class="{ 'border-transparent py-0.5': type === 'borderless' }" tabindex="0" ref="toggle">
      <div class="flex justify-between gap-3 rounded-md py-2 pl-2.5 pr-2 transition-colors hover:bg-neutral-100">
        <slot name="display" :displayedLabel="displayedLabel">
          <div class="text-sm text-default">{{ displayedLabel }}</div>
        </slot>
        <div class="flex items-center gap-1">
          <XIcon class="h-4 w-4 shrink-0" v-if="removable && model && model.length && !multiple"
            @mousedown.capture="onClear" />
          <ChevronRightIcon class="h-4 w-4 transition-all ease-in-out" :class="open ? 'rotate-90' : 'rotate-0'" />
        </div>
      </div>
    </div>
    <transition name="slide">
      <div v-if="open" ref="container"
        class="absolute z-20 max-h-[200px] w-full min-w-[240px] divide-y divide-neutral-200 overflow-hidden rounded-md border border-neutral-300 bg-white shadow transition-all duration-200 ease-in-out"
        style="transform-origin: top" :style="{ top: toggle.offsetHeight + 4 + 'px' }">
        <div v-if="searchable" class="sticky flex w-full items-center gap-1 rounded border-none pl-2.5 text-sm">
          <SearchIcon :size="18" class="text-subtle" />
          <input
            class="w-full border-none py-2.5 text-sm leading-none text-default placeholder:text-subtle focus:outline-none focus:ring-0"
            @input="onSearch" :placeholder="$t('search')" tabindex="0" />
        </div>
        <div class="flex max-h-[160px] flex-col gap-1 overflow-y-auto p-1 text-sm" tabindex="-1">
          <div v-for="option in sortedOptions" @click="onSelect(option)"
            class="grid grid-cols-2 items-center justify-center truncate gap-2 rounded-md px-1.5 py-1"
            style="grid-template-columns: 1fr 24px"
            :class="option === sortedOptions[focusedOptionIndex as number] ? 'bg-neutral-100' : 'bg-white'"
            @mouseover="focusedOptionIndex = sortedOptions.indexOf(option)"
            @focusin="focusedOptionIndex = sortedOptions.indexOf(option)">
            <slot name="default" :option="option">
              <div class="px-0.5 py-0.5 text-sm text-default truncate">{{ option.label }}</div>
            </slot>
            <CheckIcon :size="16" class="mr-1 text-strong" v-if="isSelected(option)" />
          </div>
          <div v-if="sortedOptions.length === 0">
            <div class="px-1.5 py-1 text-sm text-subtle">{{ $t("no_results") }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRef, computed, nextTick } from "vue"
import { onClickOutside, onKeyStroke } from "@vueuse/core"
import { SearchIcon, XIcon, ChevronRightIcon, CheckIcon } from "lucide-vue-next"

import i18n from "@/i18n"

const emit = defineEmits(["update:modelValue", "update:search", "select"])

interface Props {
  label?: string
  multiple?: boolean
  modelValue?: string | string[] | null
  search?: string | null
  searchable?: boolean
  removable?: boolean
  options?: { label: string; value: string }[]
  type?: "default" | "borderless"
}

const props = withDefaults(defineProps<Props>(), {
  label: "Label",
  multiple: false,
  modelValue: "",
  search: null,
  removable: true,
  type: "default",
  options: () => []
})

const open = ref(false)
const select = ref()
const container = ref(null)
const model = toRef(props, "modelValue")
const toggle = ref()
const multiple = toRef(props, "multiple")

function onClose() {
  focusedOptionIndex.value = null
  open.value = false
  toggle.value.blur()
  emit("update:search", null)
}

onClickOutside(select, onClose)

onKeyStroke("Escape", onClose)

const onSearch = (event: Event) => {
  emit("update:search", (event.target as HTMLInputElement).value)
}

const onSelect = async (option: { label: string; value: string }) => {
  // Set the focus index on the selected option
  if (props.multiple && Array.isArray(model.value)) {
    if (model.value.includes(option.value)) {
      emit(
        "update:modelValue",
        model.value.filter((id: string) => id !== option.value)
      )
    } else {
      emit("update:modelValue", [...model.value, option.value])
    }

    await nextTick()
    focusedOptionIndex.value = sortedOptions.value.indexOf(option)
  } else {
    if (model.value === option.value) {
      emit("update:modelValue", null)
    } else {
      emit("update:modelValue", option.value)
      focusedOptionIndex.value = sortedOptions.value.indexOf(option)
      emit("select", option.value)
    }
    open.value = false
  }
}

const displayedLabel = computed(() => {
  if (!model.value || !model.value.length) return props.label

  if (props.multiple && Array.isArray(model.value)) {
    return model.value.length + " " + i18n.global.t("selected")
  }

  if (!props.options.length) return i18n.global.t("no_results")
  const option = props.options.find((option) => option.value === model.value)
  return option?.label
})

const onClear = () => {
  emit("update:search", "")

  if (props.multiple) {
    emit("update:modelValue", null)
  } else {
    emit("update:modelValue", null)
  }

  toggle.value.blur()
  open.value = false
}

const isSelected = (option: { label: string; value: string }) => {
  if (props.multiple && Array.isArray(model.value)) {
    return model.value.includes(option.value)
  }

  return model.value === option.value
}

// Computed to sort selected at top
const sortedOptions = computed(() => {
  if (!props.multiple || !Array.isArray(model.value)) return props.options

  return [...props.options]
})

// Keyboard navigation
const focusedOptionIndex = ref<number | null>(null)

onKeyStroke("Enter", async () => {
  if (!open.value) return
  if (!focusedOptionIndex.value) return

  onSelect(sortedOptions.value[focusedOptionIndex.value])
})

onKeyStroke("ArrowDown", () => {
  if (focusedOptionIndex.value === null) {
    focusedOptionIndex.value = 0
    return
  }

  if (focusedOptionIndex.value === sortedOptions.value.length - 1) {
    focusedOptionIndex.value = 0
    return
  }

  focusedOptionIndex.value++
})

onKeyStroke("ArrowUp", () => {
  if (focusedOptionIndex.value === null) {
    focusedOptionIndex.value = sortedOptions.value.length - 1
    return
  }

  if (focusedOptionIndex.value === 0) {
    focusedOptionIndex.value = sortedOptions.value.length - 1
    return
  }

  focusedOptionIndex.value--
})
</script>

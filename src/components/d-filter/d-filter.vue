<template>
  <div class="relative flex min-w-0 flex-col">
    <label
      class="mb-1 block text-xs font-medium text-subtle transition ease-in-out"
      v-if="(modelValue && (modelValue as string).length) || search"
      >{{ label }}</label
    >
    <label
      ref="dropdownInput"
      class="relative cursor-pointer rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-left align-middle sm:text-sm"
      :class="{
        'border-neutral-500 outline-none ring-1 ring-neutral-500 ': state.isOpen,
        'border-neutral-600 pr-7 text-strong': modelValue && (modelValue as string).length
      }"
    >
      <input
        ref="searchRef"
        v-model="search"
        :type="searchable ? 'text' : 'button'"
        class="absolute left-3 right-3 top-1.5 z-0 w-full border-0 bg-transparent px-0 py-0 pr-10 text-sm text-strong focus:outline-none focus:ring-0"
        @focusin="state.isOpen = true"
        @keydown.down.prevent="selectNext"
        @keydown.up.prevent="selectPrevious"
        @keydown.enter.prevent="onEnter"
        @input="onCalculateWidth"
      />
      <div class="pointer-events-none z-10 flex h-full items-center">
        <template v-if="search.length <= 0">
          <div class="flex items-center space-x-2 text-neutral-900">
            <div>
              {{ dropdownLabel }}
            </div>
            <span
              v-if="multiple && (modelValue as string).length"
              class="rounded bg-blue-100 px-1 py-[1px] text-xs text-blue-600"
              >{{ (modelValue as string).length }}</span
            >
          </div>
        </template>
        <template v-else>&nbsp;</template>
      </div>
      <span class="absolute inset-y-0 right-0 z-20 flex items-center pr-2">
        <X
          v-if="modelValue && (modelValue as string).length"
          class="h-4 w-4 stroke-neutral-950"
          @click.prevent="onClearValue"
        />
      </span>
    </label>

    <div ref="dropdownMenu" class="relative">
      <transition
        leaveActiveClass="transition ease-in duration-100"
        leaveFromClass="opacity-100"
        leaveToClass="opacity-0"
      >
        <ul
          v-if="state.isOpen"
          class="absolute top-0 z-10 mt-1 max-h-60 w-full min-w-[250px] overflow-auto rounded-md bg-white px-1 py-1 text-base shadow-lg ring-1 ring-neutral-950 ring-opacity-5 focus:outline-none sm:text-sm"
          :class="{ '-top-12 -translate-y-full': openOnTop }"
        >
          <li class="mb-1 flex flex-wrap gap-2 px-2">
            <slot />
          </li>
          <li v-if="!filteredOptions.length && search" class="py-2 pl-4">Keine Treffer gefunden</li>
          <li
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            class="relative cursor-pointer select-none rounded-md py-2 pl-4 pr-4 text-sm text-strong hover:bg-neutral-50"
            :class="{ 'bg-neutral-100 text-white': index === focusedOptionIndex }"
            @click="selectedOptions = option"
          >
            <span :class="[selectedOptionIndexes.includes(index) ? 'font-semibold' : 'font-normal', 'block truncate']">
              {{ option.label }}
            </span>
            <span
              v-if="selectedOptionIndexes.includes(index)"
              class="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <Check class="h-4 w-4" aria-hidden="true"></Check>
            </span>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, reactive, ref, watch, WritableComputedRef } from "vue"
import { Check, ChevronDown, X } from "lucide-vue-next"

export interface DropdownOption {
  value: string | number | symbol | undefined
  label: string
  data?: object | undefined
}

interface DropdownState {
  isOpen: boolean
  selected: unknown[]
  search: string
}

export default defineComponent({
  components: { Check, ChevronDown, X },
  props: {
    modelValue: {
      type: [String, Number, Boolean, Object, Array],
      default: null
    },
    name: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "Wähle eine Option"
    },
    searchable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    openOnTop: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array as () => DropdownOption[],
      default: () => [] as DropdownOption[]
    }
  },
  emits: ["update:modelValue", "search", "blur", "dispose"],
  setup(props, { emit, expose }) {
    const focusedOptionIndex = ref<number>(-1)
    const searchRef = ref()
    const state = reactive({
      isOpen: false,
      selected: Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue],
      search: ""
    } as DropdownState)

    const model = ref()

    //ToDo: check perfromance we have a lot of watchers here
    watch(
      () => props.modelValue,
      (value) => {
        state.selected = Array.isArray(value) ? value : [value]
      }
    )

    /**
     * Search function
     */
    const search = computed({
      set: (value) => {
        state.search = value
        if (value) {
          selectedOptions.value = undefined
        }
      },
      get: () => state.search
    }) as WritableComputedRef<string>

    // enables us to query specific for searches
    watch(search, (value) => {
      emit("search", value)
    })

    /**
     * Select functionality
     */

    const filteredOptions = computed(() => {
      let options = props.options.filter((option: DropdownOption) => {
        return option.label.toLowerCase().includes(search.value.toLowerCase())
      })

      if (props.multiple) {
        options = options.sort((a: DropdownOption, b: DropdownOption) => {
          return state.selected.includes(a.value) && !state.selected.includes(b.value) ? -1 : 1
        })
      }

      return options
    }) as ComputedRef<DropdownOption[]>

    const selectedOptionIndexes = computed(() => {
      return state.selected.map((selected: unknown) =>
        filteredOptions.value.findIndex((option: DropdownOption) => option.value === selected)
      )
    }) as ComputedRef<number[]>

    const selectedOptions = computed({
      get: () => {
        return filteredOptions.value.filter((_, index) => selectedOptionIndexes.value?.includes(index))
      },
      set: (option: DropdownOption | DropdownOption[]) => {
        let value = (option as DropdownOption)?.value

        // deselect if already in selected
        if (state.selected.includes(value)) {
          state.selected = state.selected.filter((selected: unknown) => selected !== value)
        } else {
          state.selected = props.multiple ? [...state.selected, value] : [value]
        }

        if (option) {
          search.value = ""
          dropdownInput.value.style.width = "auto"
        }

        const result = props.multiple ? state.selected.filter((s: unknown) => !!s) : state.selected[0] || null
        model.value = result as unknown as string | number | boolean | object | Array<unknown>
        emit("update:modelValue", result)

        if (!props.multiple && !search.value) {
          state.isOpen = false
          emit("blur")
        }
      }
    }) as WritableComputedRef<DropdownOption | DropdownOption[] | undefined>

    const dropdownLabel = computed(() => {
      if (props.multiple) {
        return props.label
      }
      // @ts-ignore
      return selectedOptions.value?.[0]?.label || props.label
    })

    /**
     * Keyboard navigation stuff still a bit janky
     */

    const selectNext = () => {
      const index = focusedOptionIndex.value
      if (index < filteredOptions.value.length - 1) {
        focusedOptionIndex.value++
        return
      }

      focusedOptionIndex.value = 0
    }

    const selectPrevious = () => {
      const index = focusedOptionIndex.value
      if (index >= 0) {
        focusedOptionIndex.value--
        return
      }

      focusedOptionIndex.value = filteredOptions.value.length - 1
    }

    const dropdownMenu = ref()
    const dropdownInput = ref()
    const onFocusOut = (e: PointerEvent) => {
      if (e.composedPath().includes(dropdownMenu.value)) return
      if (e.composedPath().includes(dropdownInput.value)) return
      focusedOptionIndex.value = -1
      state.isOpen = false
      emit("blur")
    }

    watch(
      () => state.isOpen,
      (isOpen) => {
        if (isOpen) {
          // @ts-expect-error
          document.body.addEventListener("mousedown", onFocusOut)
        } else {
          // @ts-expect-error
          document.body.removeEventListener("mousedown", onFocusOut)
        }
      }
    )

    const onEnter = () => {
      onCalculateWidth()
      if (focusedOptionIndex.value === -1) {
        state.isOpen = false
        searchRef.value.blur()
        return
      }

      selectedOptions.value = filteredOptions.value[focusedOptionIndex.value]
      focusedOptionIndex.value = -1
    }

    const onClearValue = () => {
      emit("update:modelValue", props.multiple ? [] : null)
      emit("dispose")
    }

    const onCalculateWidth = () => {
      if (!search.value) {
        dropdownInput.value.style.width = "auto"
        return
      }

      let tmpElement = document.createElement("span")
      tmpElement.className = "display-none text-sm whitespace-pre"
      tmpElement.innerHTML = search.value
      document.body.appendChild(tmpElement)
      const width = tmpElement.offsetWidth
      document.body.removeChild(tmpElement)

      dropdownInput.value.style.width = `${width + 44}px`
    }

    expose({
      state,
      focusedOptionIndex,
      onFocusOut,
      searchRef
    })

    return {
      dropdownLabel,
      state,
      search,
      filteredOptions,
      selectedOptionIndexes,
      selectedOptions,
      selectNext,
      selectPrevious,
      searchRef,
      onFocusOut,
      focusedOptionIndex,
      onEnter,
      dropdownMenu,
      dropdownInput,
      model,
      onClearValue,
      onCalculateWidth
    }
  }
})
</script>

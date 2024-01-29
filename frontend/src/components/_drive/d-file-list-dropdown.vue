<script lang="ts">
export type Option = {
  text: string
  icon: any
  func: (...args: any[]) => void
}
</script>

<script setup lang="ts">
import { PropType, ref, toRef } from "vue"
import { MoreVertical } from "lucide-vue-next"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "radix-vue"

const toggleState = ref(false)

const props = defineProps({
  optionList: {
    type: Array as PropType<Option[][]>,
    required: true
  }
})

const optionList = toRef(props, "optionList")
</script>

<template>
  <DropdownMenuRoot v-model:open="toggleState">
    <DropdownMenuTrigger
      class="inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 shadow-none outline-none hover:bg-neutral-200 hover:text-neutral-900 focus:bg-neutral-200"
      aria-label="Customise options"
    >
      <MoreVertical :size="16" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="min-w-[220px] rounded-md bg-white p-1.5 shadow-[0_0px_1px_1px_rgba(0,0,0,0.08),0_5px_15px_1px_rgba(0,0,0,0.07)] outline-none drop-shadow-sm will-change-[opacity,transform]"
        :side-offset="4"
        side="left"
        align="start"
        :align-offset="24"
      >
        <template v-for="(options, i) in optionList">
          <DropdownMenuItem
            v-for="option in options"
            :value="option.text"
            class="group relative flex h-8 select-none items-center rounded-md px-2 text-sm leading-none text-neutral-700 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-100 data-[disabled]:text-neutral-300"
            @click="option.func(option.text)"
          >
            <DropdownMenuItemIndicator
              class="absolute left-0 inline-flex items-center justify-start stroke-neutral-500 px-1.5 data-[highlighted]:stroke-white"
            >
            </DropdownMenuItemIndicator>
            <div class="w-full min-w-[24px] max-w-[24px]">
              <Component :is="option.icon" :size="16" />
            </div>
            {{ option.text }}
          </DropdownMenuItem>
          <DropdownMenuSeparator v-if="i < optionList.length - 1" class="m-[5px] h-[1px] bg-neutral-200" />
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

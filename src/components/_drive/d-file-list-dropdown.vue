<script lang="ts">
export type Option = {
  text: string;
  icon: any;
  func: (...args: any[]) => void;
};
</script>

<script setup lang="ts">
import { PropType, ref, toRef } from "vue";
import { MoreVertical } from "lucide-vue-next";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "radix-vue";

const toggleState = ref(false);

const props = defineProps({
  optionList: {
    type: Array as PropType<Option[][]>,
    required: true,
  },
});

const optionList = toRef(props, "optionList");
</script>

<template>
  <DropdownMenuRoot v-model:open="toggleState">
    <DropdownMenuTrigger
      class="inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-500 shadow-none outline-none hover:bg-blue-200 hover:text-blue-900 focus:bg-blue-200"
      aria-label="Customise options"
    >
      <MoreVertical :size="16" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="min-w-[220px] rounded-md bg-white p-1.5 shadow-md outline-none will-change-[opacity,transform]"
        :side-offset="4"
        side="left"
        align="start"
        :align-offset="24"
      >
        <template v-for="(options, i) in optionList">
          <DropdownMenuItem
            v-for="option in options"
            :value="option.text"
            class="group relative flex h-7 select-none items-center rounded-md px-1 pl-8 text-sm leading-none text-stone-500 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-500 data-[disabled]:text-stone-500 data-[highlighted]:text-white"
            @click="option.func(option.text)"
          >
            <DropdownMenuItemIndicator
              class="absolute left-0 inline-flex items-center justify-start stroke-stone-500 px-1.5 data-[highlighted]:stroke-white"
            >
              <Component :is="option.icon" :size="16" />
            </DropdownMenuItemIndicator>
            {{ option.text }}
          </DropdownMenuItem>
          <DropdownMenuSeparator v-if="i < optionList.length - 1" class="m-[5px] h-[1px] bg-stone-200" />
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

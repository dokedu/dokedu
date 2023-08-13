<template>
  <div
    tabindex="0"
    :class="{
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950': true,
      'transition-color group relative inline-flex h-fit select-none items-center justify-center gap-2 overflow-hidden rounded-lg border': true,
      'border-transparent bg-inverted text-white hover:bg-blue-900': type === 'primary',
      'border-stone-200 text-stone-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-950 hover:shadow-sm':
        type === 'outline',
      'border-transparent text-stone-700 hover:bg-blue-50 hover:text-blue-950': type === 'transparent',
      'px-1 py-0.5 text-sm': size === 'xs',
      'px-2 py-1 text-sm': size === 'sm',
      'px-4 py-1.5 text-sm': size === 'md',
    }"
  >
    <component
      v-if="iconLeft"
      :is="iconLeft"
      :size="16"
      :class="{
        'stroke-stone-100 ': $props.type === 'primary',
        'stroke-stone-600 group-hover:stroke-blue-950': $props.type !== 'primary',
      }"
    />
    <slot />
    <component v-if="iconRight" :is="iconRight" :size="16" />
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "lucide-vue-next";
import { toRef } from "vue";

export interface Props {
  type?: "transparent" | "outline" | "primary";
  size?: "xs" | "sm" | "md";
  iconLeft?: Icon;
  iconRight?: Icon;
}

const props = withDefaults(defineProps<Props>(), {
  type: "primary",
  size: "md",
});

const type = toRef(props, "type");
</script>

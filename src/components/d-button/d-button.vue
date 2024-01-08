<template>
  <component :is="componentType" tabindex="1" :class="buttonClasses">
    <component v-if="iconLeft" :is="iconLeft" :size="18" :class="iconLeftClasses" />
    <slot />
    <component v-if="iconRight" :is="iconRight" :size="18" />
  </component>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import type { Icon } from "@/types/types"

import type { RouteLocationRaw } from "vue-router/auto"

export interface Props {
  type?: "transparent" | "outline" | "primary"
  size?: "xs" | "sm" | "md"
  to?: RouteLocationRaw
  submit?: boolean
  iconLeft?: Icon
  iconRight?: Icon
}

const componentType = computed(() => {
  if (props.to) {
    return "router-link"
  }
  if (props.submit) {
    return "button"
  }
  return "div"
})

const props = withDefaults(defineProps<Props>(), {
  type: "primary",
  size: "md"
})

const buttonClasses = computed(() => {
  const baseClasses = [
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 transition-color group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-lg border"
  ]

  const typeClasses = {
    primary: [
      "shadow-sm border-transparent bg-gradient-to-t from-neutral-950 to-neutral-800 text-white hover:shadow-md hover:from-neutral-900 hover:to-neutral-600 active:from-neutral-700 active:to-neutral-900"
    ],
    outline: [
      "shadow-sm border border-default text-neutral-700 hover:bg-neutral-100 active:shadow-none active:bg-gradient-to-t active:from-neutral-50 active:to-neutral-200"
    ],
    transparent: [
      "border-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 active:bg-gradient-to-t active:from-neutral-50 active:to-neutral-100"
    ]
  }

  const sizeClasses = {
    xs: ["px-1 py-0.5 text-sm"],
    sm: ["px-2 py-1 text-sm"],
    md: ["px-3 py-1.5 text-sm"]
  }

  return [...baseClasses, ...typeClasses[props.type || ""], ...sizeClasses[props.size || ""]]
})

const iconLeftClasses = computed(() => {
  if (props.type === "primary") {
    return ["stroke-neutral-100"]
  }
  return ["stroke-neutral-600", "group-hover:stroke-neutral-950"]
})
</script>

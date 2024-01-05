<template>
  <div tabindex="1" :class="buttonClasses">
    <component v-if="iconLeft" :is="iconLeft" :size="18" :class="iconLeftClasses" />
    <slot />
    <component v-if="iconRight" :is="iconRight" :size="18" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { Icon } from "lucide-vue-next"

export interface Props {
  type?: "transparent" | "outline" | "primary"
  size?: "xs" | "sm" | "md"
  iconLeft?: Icon
  iconRight?: Icon
}

const props = withDefaults(defineProps<Props>(), {
  type: "primary",
  size: "md"
})

const buttonClasses = computed(() => {
  const baseClasses = [
    "focus-visible:outline",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-neutral-950",
    "transition-color",
    "group",
    "relative",
    "inline-flex",
    "select-none",
    "items-center",
    "justify-center",
    "gap-2",
    "overflow-hidden",
    "rounded-lg",
    "border"
  ]

  const typeClasses = {
    primary: ["shadow-sm", "border-transparent", "bg-neutral-950", "text-white", "hover:bg-neutral-700"],
    outline: ["shadow-sm", "border", "border-neutral-200", "text-neutral-700", "hover:bg-neutral-100"],
    transparent: ["border-transparent", "text-neutral-700", "hover:bg-neutral-100", "hover:text-neutral-950"]
  }

  const sizeClasses = {
    xs: ["px-1", "py-0.5", "text-sm"],
    sm: ["px-2", "py-1", "text-sm"],
    md: ["px-4", "py-1.5", "text-sm"]
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

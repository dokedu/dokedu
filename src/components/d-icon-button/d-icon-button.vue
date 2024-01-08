<template>
  <div :class="classNames">
    <component :is="icon" :size="16" />
  </div>
</template>

<script lang="ts" setup>
import type { FunctionalComponent, SVGAttributes } from "vue"

interface SVGProps extends Partial<SVGAttributes> {
  size?: 24 | number
  strokeWidth?: number | string
  absoluteStrokeWidth?: boolean
}
type Icon = FunctionalComponent<SVGProps>

import { computed, toRef } from "vue"

export interface Props {
  icon: Icon
  size: "xs" | "sm" | "md" | "lg"
  type: "primary" | "secondary"
}
const props = withDefaults(defineProps<Props>(), {
  size: "md",
  type: "secondary"
})
const icon = toRef(props, "icon")

const classNames = computed(() => {
  const classes = [
    "inline-flex text-sm items-center gap-2 select-none justify-center border h-fit relative transition-all rounded-lg overflow-hidden "
  ]

  switch (props.type) {
    case "primary":
      classes.push("hover:bg-neutral-700 bg-inverted text-inverted")
      break
    case "secondary":
      classes.push("hover:bg-neutral-100")
      break
  }

  switch (props.size) {
    case "xs":
      break
    case "sm":
      classes.push("p-1")
      break
    case "md":
      classes.push("p-1.5")
      break
    case "lg":
      classes.push("p-2")
      break
  }

  return classes.join(" ")
})
</script>

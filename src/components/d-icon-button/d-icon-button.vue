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
  type: "primary" | "outline" | "transparent"
}
const props = withDefaults(defineProps<Props>(), {
  size: "sm",
  type: "outline"
})
const icon = toRef(props, "icon")

const classNames = computed(() => {
  const classes = [
    "inline-flex text-sm items-center gap-2 select-none justify-center border h-fit relative transition-all rounded-lg overflow-hidden"
  ]

  switch (props.type) {
    case "primary":
      classes.push(
        "hover:bg-neutral-700 bg-inverted text-inverted border-intense bg-gradient-to-t from-neutral-950 to-neutral-800 hover:shadow-md hover:from-neutral-900 hover:to-neutral-600 active:from-neutral-700 active:to-neutral-900"
      )
      break
    case "outline":
      classes.push(
        "hover:bg-neutral-100 border-default active:shadow-none active:bg-gradient-to-t active:from-neutral-50 active:to-neutral-200"
      )
      break
    case "transparent":
      classes.push(
        "border-transparent hover:border-default hover:bg-neutral-100 hover:text-neutral-950 active:bg-gradient-to-t active:from-neutral-50 active:to-neutral-100"
      )
  }

  ;["px-3 py-1.5 text-sm"]
  switch (props.size) {
    case "xs":
      classes.push("p-1")
      break
    case "sm":
      classes.push("p-1.5")
      break
    case "md":
      classes.push("p-2")
      break
    case "lg":
      classes.push("p-2.5")
      break
  }

  return classes.join(" ")
})
</script>

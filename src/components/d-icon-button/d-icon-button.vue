<template>
  <div :class="classNames">
    <component :is="icon" :size="16" />
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "lucide-vue-next"
import { computed, toRef } from "vue"

export interface Props {
  icon: Icon
  size: "xs" | "sm" | "md"
}

const props = defineProps<Props>()
const icon = toRef(props, "icon")

const classNames = computed(() => {
  const classes = [
    "inline-flex text-sm items-center gap-2 select-none justify-center border h-fit relative transition-all rounded-lg overflow-hidden hover:bg-neutral-50"
  ]

  switch (props.size) {
    case "xs":
      break
    case "sm":
      classes.push("p-1")
      break
    case "md":
      classes.push("p-1.5")
      break
  }

  return classes.join(" ")
})
</script>

<template>
  <div
    v-show="props.amount > 0"
    class="px-1 rounded-full tabular-nums grid place-items-center text-xs"
    :class="inverted ? 'bg-white text-strong' : 'bg-inverted text-white'"
  >
    {{ computedAmount }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

type Props = {
  amount: number
  inverted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  inverted: false
})

const computedAmount = computed(() => {
  // return 99+ if amount is higher than 99
  return props.amount > 99 ? "99+" : props.amount
})
</script>

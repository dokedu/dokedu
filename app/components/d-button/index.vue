<script setup lang="ts">
import { LoaderCircleIcon } from "lucide-vue-next"
import { RouterLink } from "vue-router"

interface Props {
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "danger-light" | "transparent"
  iconLeft?: any
  to?: any
  type?: "submit" | "button" | any
  loading?: boolean
}

const { variant = "primary", type = "button", loading = false } = defineProps<Props>()
</script>

<template>
  <component
    :is="to ? RouterLink : 'button'"
    :type
    :to
    class="relative flex h-8 min-w-8 cursor-default items-center gap-2 rounded-md py-1.5 text-sm ring-blue-600 ring-offset-2 outline-none focus:ring-2"
    :class="[
      variant === 'primary' ? 'bg-neutral-900 text-neutral-50 hover:bg-neutral-700' : '',
      variant === 'secondary' ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200' : '',
      variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' : '',
      variant === 'danger-light' ? 'bg-red-100 text-red-800 hover:bg-red-200' : '',
      variant === 'transparent' ? 'text-neutral-500 hover:bg-neutral-200' : '',
      variant === 'tertiary' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : '',
      $slots.default ? 'px-2.5' : 'px-1.5'
    ]"
  >
    <component v-if="iconLeft" :is="iconLeft" class="size-4 mx-auto" :class="{ 'opacity-0': loading }" />
    <div v-if="$slots.default" class="inline leading-0" :class="{ 'opacity-0': loading }">
      <slot></slot>
    </div>
    <div v-if="loading" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <LoaderCircleIcon class="size-5 animate-spin" />
    </div>
  </component>
</template>

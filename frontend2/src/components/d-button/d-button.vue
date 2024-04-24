<template>
  <component :is="componentType" tabindex="0" :class="buttonClasses">
    <component v-if="iconLeft" :is="iconLeft" :size="18" :class="iconLeftClasses" />
    <slot />
    <component v-if="iconRight" :is="iconRight" :size="18" />
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import type { RouteLocationRaw } from 'vue-router/auto'

type Icon = any

export interface Props {
  variant?: 'transparent' | 'outline' | 'primary'
  size?: 'xs' | 'sm' | 'md'
  to?: RouteLocationRaw
  submit?: boolean
  iconLeft?: Icon
  iconRight?: Icon
}

const componentType = computed(() => {
  if (props.to) {
    return 'router-link'
  }
  if (props.submit) {
    return 'button'
  }
  return 'div'
})

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'md'
})

const buttonClasses = computed(() => {
  const baseClasses = [
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-color group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-lg border'
  ]

  const typeClasses = {
    primary: [
      'shadow-sm border-transparent bg-neutral-950 text-white hover:shadow-md hover:bg-neutral-800 active:bg-neutral-700'
    ],
    outline: [
      'shadow-sm bg-white border border-default text-neutral-700 hover:bg-neutral-100 active:shadow-none  active:to-neutral-200'
    ],
    transparent: [
      'border-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 active:from-neutral-50 active:to-neutral-100'
    ]
  }

  const sizeClasses = {
    xs: ['px-1 py-0.5 text-sm'],
    sm: ['px-2 py-1 text-sm'],
    md: ['px-3 py-1.5 text-sm']
  }

  return [...baseClasses, ...typeClasses[props.variant || ''], ...sizeClasses[props.size || '']]
})

const iconLeftClasses = computed(() => {
  if (props.variant === 'primary') {
    return ['stroke-neutral-100']
  }
  return ['stroke-neutral-600', 'group-hover:stroke-neutral-950']
})
</script>

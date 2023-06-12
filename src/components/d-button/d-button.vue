<template>
    <div :class="{
        'inline-flex items-center gap-2 select-none justify-center border h-fit relative transition-all rounded-lg overflow-hidden group': true,
        'text-white bg-inverted hover:bg-blue-900 border-transparent': type === 'primary',
        'text-stone-700 hover:shadow-sm hover:bg-blue-50 border-stone-200 hover:border-blue-200 hover:text-blue-950': type === 'outline',
        'text-stone-700 hover:bg-blue-50 border-transparent hover:text-blue-950': type === 'transparent',
        'px-1 py-0.5 text-sm': size === 'xs',
        'px-2 py-1 text-sm': size === 'sm',
        'px-4 py-1.5 text-sm': size === 'md',
    }">
        <component v-if="iconLeft" :is="iconLeft" :size="16" :class="{
            'stroke-stone-100 ': $props.type === 'primary',
            'stroke-stone-600 group-hover:stroke-blue-950': $props.type !== 'primary',
        }" />
        <slot />
        <component v-if="iconRight" :is="iconRight" :size="16" />
    </div>
</template>

<script lang="ts" setup>
import { Icon } from 'lucide-vue-next';
import { toRef } from 'vue';

export interface Props {
    type?: 'transparent' | 'outline' | 'primary'
    size?: 'xs' | 'sm' | 'md'
    iconLeft?: Icon
    iconRight?: Icon
}

const props = withDefaults(defineProps<Props>(), {
    type: 'primary',
    size: 'md',
})

const type = toRef(props, 'type')
</script>

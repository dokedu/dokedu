<template>
    <div :class="classNames">
        <component v-if="iconLeft" :is="iconLeft" :size="16"
            :class="$props.type === 'primary' ? 'stroke-gray-100' : 'stroke-gray-600'" />
        <slot />
        <component v-if="iconRight" :is="iconRight" :size="16" />
    </div>
</template>

<script lang="ts" setup>
import { Icon } from 'lucide-vue-next';
import { computed } from 'vue';

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

const classNames = computed(() => {
    const classes = ['inline-flex items-center gap-2 select-none justify-center border h-fit relative transition-all rounded-lg overflow-hidden group']

    switch (props.type) {
        case 'transparent':
            classes.push('text-gray-700 hover:bg-gray-50 border-transparent')
            break
        case 'outline':
            classes.push('text-gray-700 hover:shadow hover:bg-gray-50 border-gray-200')
            break
        case 'primary':
            classes.push('text-white bg-gray-950 hover:bg-gray-800 border-transparent')
            break
    }

    switch (props.size) {
        case 'xs':
            break
        case 'sm':
            classes.push('px-2 py-1 text-sm')
            break
        case 'md':
            break
    }

    return classes.join(' ')
})

</script>

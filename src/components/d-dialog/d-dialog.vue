<template>
    <dialog ref="dialog" class="backdrop:bg-stone-900/90 rounded-lg" @close="close">
        <header class="mb-4 text-sm font-medium">Rename</header>
        <slot></slot>
        <footer class="flex justify-between mt-3">
            <d-button @click="close" type="outline" size="md">Cancel</d-button>
            <d-button @click="close" type="primary" size="md">Create</d-button>
        </footer>
    </dialog>
</template>

<script lang="ts" setup>
import { ref, toRef, watch } from 'vue';
import dButton from '../d-button/d-button.vue';

const dialog = ref<HTMLDialogElement | null>(null);

export interface Props {
    open: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
});

const emit = defineEmits(['close']);

const open = toRef(props, 'open');

watch(open, (value) => {
    if (value) {
        dialog.value?.showModal();
    } else {
        emit('close');
        dialog.value?.close();
    }
});

function close(e) {
    if (e) {
        e.preventDefault();
    }
    emit('close');
    dialog.value?.close();
}
</script>
<template>
    <div class="rounded-lg border border-stone-200 relative p-1.5" @click="open = true" :class="{ 'shadow-md': open }">
        <d-competence-level-icon :level="level" />
        <div ref="menu" v-if="open"
            class="absolute w-52 shadow-md right-8 -top-2 bg-white rounded-md border border-stone-200">
            <div class="flex flex-col p-1 border-b">
                <div class="flex gap-2 text-sm items-center rounded-md justify-between hover:bg-stone-100 px-3 py-1 text-stone-700"
                    @click="update(0)">
                    <div class="flex gap-3 items-center">
                        <d-competence-level-icon :level="0" />
                        <div>No level</div>
                    </div>
                    <Check v-if="level === 0" :size="16" class="stroke-stone-700" />
                </div>
            </div>
            <div class="flex flex-col p-1">
                <div class="flex gap-2 text-sm items-center rounded-md justify-between hover:bg-stone-100 px-3 py-1 text-stone-700"
                    @click="update(1)">
                    <div class="flex gap-3 items-center">
                        <d-competence-level-icon :level="1" />
                        <div>Low</div>
                    </div>
                    <Check v-if="level === 1" :size="16" class="stroke-stone-700" />
                </div>
                <div class="flex gap-2 text-sm items-center rounded-md justify-between hover:bg-stone-100 px-3 py-1 text-stone-700"
                    @click="update(2)">
                    <div class="flex gap-3 items-center">
                        <d-competence-level-icon :level="2" />
                        <div>Medium</div>
                    </div>
                    <Check v-if="level === 2" :size="16" class="stroke-stone-700" />
                </div>
                <div class="flex gap-2 text-sm items-center rounded-md justify-between hover:bg-stone-100 px-3 py-1 text-stone-700"
                    @click="update(3)">
                    <div class="flex gap-3 items-center">
                        <d-competence-level-icon :level="3" />
                        <div>High</div>
                    </div>
                    <Check v-if="level === 3" :size="16" class="stroke-stone-700" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import DCompetenceLevelIcon from './d-competence-level-icon.vue';
import { Check } from 'lucide-vue-next';

const props = defineProps<{ id: string, level: number, editable: boolean }>();
const emit = defineEmits(["update"]);

const open = ref(false);
const menu = ref();

onClickOutside(menu, () => open.value = false)

onKeyStroke("Escape", () => {
    open.value = false;
});

function update(level: number) {
    if (props.editable) {
        emit('update', { id: props.id, level });
    }
    open.value = false;
}
</script>
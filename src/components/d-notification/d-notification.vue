<template>
  <transition appear>
    <div
      @mouseover="onMouseover"
      @mouseleave="onMouseleave"
      class="absolute bottom-6 right-6 min-w-[300px] overflow-hidden rounded-lg border border-neutral-100 bg-white shadow-md"
    >
      <div>
        <div class="p-4">
          <div class="flex gap-2" :class="{ 'items-start': description, 'items-center': !description }">
            <component v-if="icon" :is="icon" class="h-4 w-4"></component>

            <div class="w-0 flex-1 text-sm font-medium text-strong">
              <p>
                {{ title }}
              </p>
              <p v-if="description" class="text-sm text-subtle">
                {{ description }}
              </p>

              <div v-if="slots.actions" class="mt-3 flex items-center gap-2">
                <slot name="actions"></slot>
              </div>
            </div>
            <div class="flex flex-shrink-0 items-center gap-3">
              <button @click.stop="onClose">
                <component :is="closeIcon" class="h-4 w-4"></component>
              </button>
            </div>
          </div>
        </div>
        <div v-if="timeout" class="h-0.5 bg-blue-600" :style="progressStyle" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from "vue";
import { useTimer } from "@/composables/useTimer";
import { Icon } from "lucide-vue-next";
import { X } from "lucide-vue-next";
import { useSlots } from "vue";

const slots = useSlots();

export interface Props {
  title: string;
  description: string;
  icon?: Icon;
  closeIcon?: Icon;
  timeout?: number;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  closeIcon: X,
  timeout: 5000,
});

const emit = defineEmits(["close"]);

let timer: any = null;
const remaining = ref(props.timeout);

const progressStyle = computed(() => {
  const remainingPercent = (remaining.value / props.timeout) * 100;

  return { width: `${remainingPercent || 0}%` };
});

function onMouseover() {
  if (timer) {
    timer.pause();
  }
}

function onMouseleave() {
  if (timer) {
    timer.resume();
  }
}

function onClose() {
  if (timer) {
    timer.stop();
  }

  emit("close");
}

onMounted(() => {
  if (!props.timeout) {
    return;
  }

  timer = useTimer(() => {
    onClose();
  }, props.timeout);

  watchEffect(() => {
    remaining.value = timer.remaining.value;
  });
});

onUnmounted(() => {
  if (timer) {
    timer.stop();
  }
});
</script>

<template>
  <div
    ref="target"
    v-show="show"
    class="absolute z-10 max-h-[100vh] w-[225px] rounded-md bg-stone-50 shadow"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
export enum ContextMenuAlignment {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
  Overlay,
}
</script>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, reactive, ref, toRef, watch, nextTick } from "vue";
import { useParentElement, onClickOutside, onKeyStroke } from "@vueuse/core";
import { useWindowSize } from "@vueuse/core";

interface Point {
  x: number;
  y: number;
}

const props = defineProps<{
  show: boolean;
  alignment: ContextMenuAlignment;
}>();

onKeyStroke("Escape", () => {
  emit("close");
});

const target = ref(null);

const show = toRef(props, "show");

const emit = defineEmits(["close"]);

const { width } = useWindowSize();

onClickOutside(target, () => {
  emit("close");
});

const position = reactive<Point>({
  x: 0,
  y: 0,
});

const instance = getCurrentInstance();

const parentEl = useParentElement();

onMounted(() => {
  // @ts-expect-error
  updatePosition(parentEl.value);
});

watch(width, () => {
  // @ts-expect-error
  updatePosition(parentEl.value);
});

watch(show, async () => {
  if (!show.value) return;
  await nextTick();
  // @ts-expect-error
  updatePosition(parentEl.value);
});

async function updatePosition(point: Point | HTMLElement) {
  const newPosition = point as Point;
  let { alignment } = props;

  const instanceBounds = instance?.proxy?.$el.getBoundingClientRect();

  let bounds = null;
  if (point instanceof HTMLElement) {
    bounds = point.getBoundingClientRect();
  }

  if (!alignment) {
    if (bounds) {
      newPosition.x = bounds.right;
      newPosition.y = bounds.top;
    }

    if (newPosition.x + instanceBounds.width >= window.innerWidth) {
      alignment = ContextMenuAlignment.TopLeft;
    }

    if (newPosition.x <= 0) {
      newPosition.x += instanceBounds.width;
    }
  }

  if (bounds) {
    switch (alignment) {
      case ContextMenuAlignment.BottomRight:
        newPosition.x = bounds.right - instanceBounds.width;
        newPosition.y = bounds.bottom + 4;
        console.log(instanceBounds);
        break;
      case ContextMenuAlignment.BottomLeft:
        newPosition.x = bounds.left;
        newPosition.y = bounds.bottom + 4;
        break;
      case ContextMenuAlignment.Overlay:
        newPosition.x = bounds.left;
        newPosition.y = bounds.top + 4;
        break;
      case ContextMenuAlignment.TopLeft:
        newPosition.x = bounds.left - instanceBounds.width;
        newPosition.y = bounds.top;
        break;
      case ContextMenuAlignment.TopRight:
      default:
        newPosition.x = bounds.right;
        newPosition.y = bounds.top;
        break;
    }

    const viewPortHeight = window.innerHeight;
    const viewPortWidth = window.innerWidth;

    // Check if the context menu is too big for the viewport
    if (newPosition.y + instanceBounds.height > viewPortHeight) {
      newPosition.y = bounds.bottom - instanceBounds.height + 4;
    }

    if (newPosition.x + instanceBounds.width > viewPortWidth) {
      newPosition.x = viewPortWidth - instanceBounds.width - 16;
    }
  }

  position.x = newPosition.x;
  position.y = newPosition.y - 4;
}
</script>

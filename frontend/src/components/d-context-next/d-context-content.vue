<template>
  <ContextMenuContent
    class="shadow z-30 bg-neutral-50 outline-none rounded-lg py-1 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
    :side-offset="5"
  >
    <d-popover>
      <slot />
    </d-popover>
  </ContextMenuContent>
</template>

<script setup lang="ts">
import { ContextMenuContent } from "radix-vue"
</script>

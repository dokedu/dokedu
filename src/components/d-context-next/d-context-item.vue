<template>
  <d-popover-item>
    <ContextMenuItem class="h-full outline-none flex items-center gap-2"><slot /></ContextMenuItem>
  </d-popover-item>
</template>
<script setup lang="ts">
import { ContextMenuItem } from "radix-vue"
import DPopoverItem from "@/components/d-popover/d-popover-item.vue"
</script>

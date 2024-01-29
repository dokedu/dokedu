<template>
  <ContextMenuItem as-child class="h-full outline-none flex items-center gap-2">
    <d-popover-item><slot /></d-popover-item>
  </ContextMenuItem>
</template>
<script setup lang="ts">
import { ContextMenuItem } from "radix-vue"
import DPopoverItem from "@/components/d-popover/d-popover-item.vue"
</script>

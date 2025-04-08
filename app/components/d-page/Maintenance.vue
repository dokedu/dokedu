<script setup lang="ts">
import { ConstructionIcon } from "lucide-vue-next"
</script>

<template>
  <div class="flex h-full w-full items-center justify-center p-4">
    <div class="mx-auto max-w-96 rounded-md border border-orange-100 bg-orange-200/60 p-8">
      <div class="mb-2 flex items-center gap-3 text-lg font-medium text-orange-900">
        <ConstructionIcon class="size-6 text-orange-900" />
        Wartungsarbeiten
      </div>
      <div class="mb-2 text-sm text-orange-800">Wir arbeiten aktuell an einer Wartung des Systems. Bitte versuche es in Kürze noch einmal.</div>
      <div class="text-sm text-orange-800">
        In dringenden Fällen kontaktiere bitte das Support-Team unter
        <a href="mailto:support@dokedu.org" class="font-medium text-orange-900 hover:underline">support@dokedu.org</a>.
      </div>
    </div>
  </div>
</template>

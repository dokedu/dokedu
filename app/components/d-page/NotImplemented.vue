<script setup lang="ts">
import { ConstructionIcon } from "lucide-vue-next"
</script>

<template>
  <div class="flex h-full w-full items-center justify-center p-4">
    <div class="mx-auto max-w-96 rounded-md border border-orange-100 bg-orange-100 p-8">
      <div class="mb-2 flex items-center gap-3 text-lg font-medium text-orange-900">
        <ConstructionIcon class="size-6 text-orange-900" />
        In Arbeit
      </div>
      <div class="mb-2 text-sm text-orange-800">Diese Seite befindet sich noch im Aufbau. Bitte schaue zu einem späteren Zeitpunkt noch einmal vorbei.</div>
      <div class="text-sm text-orange-800">
        In dringenden Fällen kontaktiere bitte das Support-Team unter
        <a href="mailto:support@dokedu.org" class="font-medium text-orange-900 hover:underline">support@dokedu.org</a>.
      </div>
    </div>
  </div>
</template>

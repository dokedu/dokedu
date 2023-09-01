<template>
  <div class="flex h-screen w-full select-none flex-col items-center justify-center gap-8 p-8 text-center text-sm">
    <div class="max-w-md text-subtle">
      <div class="mb-2 text-base font-medium text-strong">Diese Seite wurde nicht gefunden.</div>
      <div>Bitte überprüfe die URL.</div>
    </div>
    <d-button type="primary" @click="signOut">{{ $t("log_out") }}</d-button>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "layout": "none"
  }
}
</route>

<script lang="ts" setup>
import DButton from "@/components/d-button/d-button.vue";
import { useAuth } from "@/composables/auth";

const { signOut } = useAuth();
</script>

<template>
  <div class="flex h-14 items-center justify-between border-b border-neutral-100 px-8 py-3">
    <div class="flex items-center">
      <router-link :to="{ name: '/record/entries/' }">
        <d-icon-button size="md" :icon="X"> </d-icon-button>
      </router-link>
    </div>
    <div class="flex gap-2">
      <d-button size="md" :icon-left="Trash2" type="outline" @click="$emit('archive')">
        {{ $t("archive") }}
      </d-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DButton from "../d-button/d-button.vue";
import DIconButton from "../d-icon-button/d-icon-button.vue";
import { X, Trash2 } from "lucide-vue-next";

defineEmits(["submit", "archive"]);
</script>

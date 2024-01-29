<template>
  <div class="w-full h-full flex items-center justify-center flex-col gap-4">
    <div class="w-full flex items-center justify-center gap-10">
      <div class="gap-2 flex items-center">
        <d-button size="xs" type="transparent">Share</d-button>
        <d-button size="xs" type="transparent" :icon="MessageCircle">This is a very long button</d-button>
        <d-icon-button size="xs" type="transparent" :icon="BookUser"></d-icon-button>
      </div>
      <div class="gap-2 flex items-center">
        <d-button size="sm" type="transparent">Share</d-button>
        <d-button size="sm" type="transparent" :icon="MessageCircle">This is a very long button</d-button>
        <d-icon-button size="sm" type="transparent" :icon="BookUser"></d-icon-button>
      </div>
      <div class="gap-2 flex items-center">
        <d-button size="md" type="transparent">Share</d-button>
        <d-button size="md" type="transparent" :icon="MessageCircle">This is a very long button</d-button>
        <d-icon-button size="md" type="transparent" :icon="BookUser"></d-icon-button>
      </div>
    </div>
    <div class="w-full flex items-center justify-center gap-10">
      <div class="gap-2 flex items-center">
        <d-button size="xs" type="outline">Share</d-button>
        <d-button size="xs" type="outline" :icon="MessageCircle">This is a very long button</d-button>
        <d-icon-button size="xs" type="outline" :icon="BookUser"></d-icon-button>
      </div>
      <div class="gap-2 flex items-center">
        <d-button size="sm" type="outline">Share</d-button>
        <d-button size="sm" type="outline" :icon="MessageCircle">This is a very long button</d-button>
        <d-icon-button size="sm" type="outline" :icon="BookUser"></d-icon-button>
      </div>
      <div class="gap-2 flex items-center">
        <d-button size="md" type="outline">Share</d-button>
        <d-button size="md" type="outline" :icon="MessageCircle">This is a very long button</d-button>
        <d-icon-button size="md" type="outline" :icon="BookUser"></d-icon-button>
      </div>
    </div>
    <div class="w-full flex items-center justify-center gap-10">
      <div class="gap-2 flex items-center">
        <d-button size="xs" type="primary">Share</d-button>
        <d-button size="xs" type="primary" :icon="MessageCircle">This is a very long button</d-button>
        <d-icon-button size="xs" type="primary" :icon="BookUser"></d-icon-button>
      </div>
      <div class="gap-2 flex items-center">
        <d-button size="sm" type="primary">Share</d-button>
        <d-button size="sm" type="primary" :icon="MessageCircle">This is a very long button</d-button>
        <d-icon-button size="sm" type="primary" :icon="BookUser"></d-icon-button>
      </div>
      <div class="gap-2 flex items-center">
        <d-button size="md" type="primary">Share</d-button>
        <d-button size="md" type="primary" :icon="MessageCircle">This is a very long button</d-button>
        <d-icon-button size="md" type="primary" :icon="BookUser"></d-icon-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DButton from "@/components/d-button/d-button.vue"
import DIconButton from "@/components/d-icon-button/d-icon-button.vue"
import { BookUser, MessageCircle } from "lucide-vue-next"
</script>

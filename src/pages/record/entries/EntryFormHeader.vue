<template>
  <div class="flex items-center justify-between border-b border-stone-100 px-8 py-3 h-14">
    <div class="flex items-center">
      <router-link :to="{ name: 'record-entries' }">
        <d-icon-button size="md" :icon="X">
        </d-icon-button>
      </router-link>

    </div>
    <div class="flex gap-2">
      <d-button v-if="mode !== 'new'" size="md" :icon-left="Trash2" type="outline" @click="$emit('archive')">
        Archive
      </d-button>
      <d-button type="primary" size="md" :icon-left="Save" @click="$emit('submit')">
        {{ mode === "new" ? "Create" : "Save" }}
      </d-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import DButton from "../../../components/d-button/d-button.vue";
import DIconButton from "../../../components/d-icon-button/d-icon-button.vue";
import { Save, X, Trash2 } from "lucide-vue-next";

defineProps<{ mode: "new" | "edit" }>();
defineEmits(["submit", "archive"]);
</script>

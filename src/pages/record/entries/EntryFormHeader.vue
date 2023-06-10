<template>
  <div class="flex items-center justify-between border-b px-8 py-4">
    <div class="flex items-center">
      <router-link :to="{ name: 'record-entries' }" type="button"
        class="rounded-md p-1 text-gray-500 outline-0 transition-all hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
        <XIcon />
      </router-link>
    </div>
    <div class="flex gap-2">
      <d-button v-if="mode !== 'new'" size="sm" :icon-left="Trash2" type="outline" @click="$emit('archive')">
        Archive
      </d-button>
      <d-button type="primary" size="sm" :icon-left="Save" @click="$emit('submit')">
        {{ mode === "new" ? "Create" : "Save" }}
      </d-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { XIcon } from "lucide-vue-next";
import DButton from "../../../components/d-button/d-button.vue";
import { Save } from "lucide-vue-next";
import { Trash2 } from "lucide-vue-next";

const props = defineProps<{ mode: "new" | "edit" }>();
const emit = defineEmits(["submit", "archive"]);
</script>

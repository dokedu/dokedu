<template>
  <div class="flex items-center justify-between border-b px-8 py-4">
    <div class="flex items-center">
      <router-link
        :to="{ name: 'record-entries' }"
        type="button"
        class="rounded-md p-1 text-gray-500 outline-0 transition-all hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        <XIcon />
      </router-link>
    </div>
    <div class="flex gap-2">
      <button
        v-if="mode !== 'new'"
        type="button"
        class="rounded-md bg-red-50 px-4 py-1 text-red-500 outline-0 transition-all hover:bg-red-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        @click="$emit('archive')"
      >
        Archive
      </button>
      <button
        type="button"
        class="rounded-md bg-gray-950 px-4 py-1 text-white outline-0 transition-all hover:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        @click="$emit('submit')"
      >
        {{ mode === "new" ? "Create" : "Save" }}
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { XIcon } from "lucide-vue-next";

const props = defineProps<{ mode: "new" | "edit" }>();
const emit = defineEmits(["submit", "archive"]);
</script>

<template>
  <div class="px-2 py-4" @click="addTag">
    <div class="mb-1 px-2 text-stone-500">Labels</div>
    <button type="button" class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-stone-500">
      <Plus :size="18" />
      <div>Label hinzufügen</div>
    </button>
    <template v-if="sheetOpen">
      <MSheet @close="sheetOpen = false">
        <div class="p-2 text-sm">
          <d-input v-model="search" type="text" name="search" id="search" placeholder="Search tag" />
          <div class="flex flex-col divide-y py-2">
            <div v-for="tag in 5" class="p-2">Hello, World!</div>
          </div>
        </div>
      </MSheet>
    </template>
  </div>
</template>

<script lang="ts" setup>
import MSheet from "@/components/mobile/m-sheet.vue";
import DInput from "@/components/d-input/d-input.vue";
import { Plus } from "lucide-vue-next";
import { ref } from "vue";

const search = ref("");
const sheetOpen = ref(false);

function addTag() {
  sheetOpen.value = true;
}
</script>

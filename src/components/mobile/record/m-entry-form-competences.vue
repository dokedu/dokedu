<template>
  <div class="p-4">
    <button
      @click="addCompetence"
      type="button"
      class="flex w-full items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-8 py-2.5 text-center text-sm text-stone-500"
    >
      <Plus :size="18" />
      <div>Kompetenz hinzufügen</div>
    </button>
    <template v-if="sheetOpen">
      <MSheet @close="sheetOpen = false">
        <div class="p-2 text-sm">
          <d-input v-model="search" type="text" name="search" id="search" placeholder="Search competence" />
          <div class="flex flex-col divide-y py-2">
            <div v-for="competence in 5" class="p-2">Hello, World!</div>
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

function addCompetence() {
  sheetOpen.value = true;
}
</script>

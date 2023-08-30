<template>
  <div class="p-4">
    <div class="mb-2 flex flex-col gap-2">
      <DCompetence v-for="c in uniqueCompetences" :key="c.id" :competence="c">
        <div class="rounded-md p-1 hover:bg-stone-100" @click="toggleCompetence(c)">
          <X :size="20" class="stroke-stone-500" />
        </div>
      </DCompetence>
    </div>
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
        <div class="p-2">
          <DCompetenceSearch :selected="uniqueCompetences" @add="toggleCompetence" />
        </div>
      </MSheet>
    </template>
  </div>
</template>

<script lang="ts" setup>
import MSheet from "@/components/mobile/m-sheet.vue";
import DCompetence from "@/components/d-competence/d-competence.vue";
import DCompetenceSearch from "@/components/d-competence-search/d-competence-search.vue";
import { Plus, X } from "lucide-vue-next";
import { computed, ref } from "vue";

const sheetOpen = ref(false);

function addCompetence() {
  sheetOpen.value = true;
}

import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const competences = useVModel(props, "modelValue", emit);

// by competences[0].competence.id
const uniqueUserCompetences = computed(() => {
  const ids = competences.value.map((c) => c.competence.id);
  return competences.value.filter((c, i) => ids.indexOf(c.competence.id) === i);
});

const uniqueCompetences = computed(() => {
  if (uniqueUserCompetences.value.length === 0) return [];
  return uniqueUserCompetences.value.map((el) => el.competence);
});

function toggleCompetence(competence: any) {
  const index = competences.value.findIndex((c) => c.competence.id === competence.id);
  if (index === -1) {
    competences.value.push({
      competence,
      level: 0,
    });
  } else {
    competences.value.splice(index, 1);
  }
}
</script>

<template>
  <div class="p-4">
    <div class="mb-2 flex flex-col gap-2">
      <DCompetence v-for="c in uniqueCompetences" :key="c.competence.id" :competence="c.competence">
        <d-competence-level :id="c.competence.id" :level="c.level" :editable="true" @update="updateCompetenceLevel" />
        <div class="rounded-md p-1 hover:bg-stone-100" @click="toggleCompetence(c.competence)">
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
        <div class="p-2" :style="{ height: sheetHeight + 'px' }">
          <DCompetenceSearch :selected="uCompetence" @add="toggleCompetence" />
        </div>
      </MSheet>
    </template>
  </div>
</template>

<script lang="ts" setup>
import MSheet from "@/components/mobile/m-sheet.vue";
import DCompetence from "@/components/d-competence/d-competence.vue";
import DCompetenceSearch from "@/components/d-competence-search/d-competence-search.vue";
import DCompetenceLevel from "@/components/d-competence-level.vue";
import { Plus, X } from "lucide-vue-next";
import { computed, ref } from "vue";

const sheetOpen = ref(false);

const { height } = useWindowSize();
const sheetHeight = computed(() => height.value - 72);

function addCompetence() {
  sheetOpen.value = true;
}

import { useVModel, useWindowSize } from "@vueuse/core";

const props = defineProps<{
  modelValue: any;
}>();
const emit = defineEmits(["update:modelValue"]);

const entry = useVModel(props, "modelValue", emit);

const competences = computed({
  get() {
    return entry.value.userCompetences || [];
  },
  set(value) {
    entry.value.userCompetences = value;
  },
});

// by competences[0].competence.id
const uniqueUserCompetences = computed(() => {
  const ids = competences.value.map((c: any) => c.competence.id);
  return competences.value.filter((c: any, i: any) => ids.indexOf(c.competence.id) === i);
});

const uniqueCompetences = computed(() => {
  if (uniqueUserCompetences.value.length === 0) return [];
  return uniqueUserCompetences.value.map((el: any) => el);
});

const uCompetence = computed(() => {
  return uniqueCompetences.value.map((el: any) => el.competence);
});

function toggleCompetence(competence: any) {
  const eac = competences.value.find((eac: any) => eac.competence.id === competence.id);
  if (eac) {
    competences.value = competences.value.filter((eac: any) => eac.competence.id !== competence.id);
  } else {
    competences.value.push({
      competence,
      level: 0,
    });
  }
}

function updateCompetenceLevel(data: { id: string; level: number }) {
  const eacs = entry.value.userCompetences?.filter((eac: any) => eac.competence.id === data.id);
  for (const eac of eacs) {
    eac.level = data.level;
  }
}
</script>

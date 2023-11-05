<template>
  <div class="p-4">
    <div class="mb-2 flex flex-col gap-2">
      <DCompetence v-for="c in uniqueCompetences" :key="c.competence.id" :competence="c.competence">
        <d-competence-level :id="c.competence.id" :level="c.level" :editable="true" @update="updateCompetenceLevel" />
        <div class="rounded-md p-1 hover:bg-neutral-100" @click="toggleCompetence(c.competence)">
          <X :size="20" class="stroke-neutral-500" />
        </div>
      </DCompetence>
    </div>
    <button
      @click="addCompetence"
      type="button"
      class="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-8 py-2.5 text-center text-sm text-neutral-500"
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
import { Plus, X } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useVModel, useWindowSize } from "@vueuse/core";
import { useMutation } from "@urql/vue";
import MSheet from "@/components/mobile/m-sheet.vue";
import DCompetence from "@/components/d-competence/d-competence.vue";
import DCompetenceSearch from "@/components/d-competence-search/d-competence-search.vue";
import DCompetenceLevel from "@/components/d-competence/d-competence-level.vue";
import deleteEntryCompetenceMutation from "@/queries/deleteEntryCompetence.mutation.ts";
import updateEntryUserCompetenceMutation from "@/queries/updateEntryUserCompetence.mutation.ts";
import createEntryCompetenceMutation from "@/queries/createEntryCompetence.mutation.ts";

const { executeMutation: deleteEntryCompetence } = useMutation(deleteEntryCompetenceMutation);
const { executeMutation: createEntryCompetence } = useMutation(createEntryCompetenceMutation);
const { executeMutation: updateEntryUserCompetenceLevel } = useMutation(updateEntryUserCompetenceMutation);

const sheetOpen = ref(false);

const { height } = useWindowSize();
const sheetHeight = computed(() => height.value - 72);

function addCompetence() {
  sheetOpen.value = true;
}

const props = defineProps<{
  entry: any;
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

async function toggleCompetence(competence: any) {
  const eac = competences.value.find((eac: any) => eac.competence.id === competence.id);
  if (eac) {
    await deleteEntryCompetence({ input: { entryId: entry.value.id, competenceId: competence.id } });
  } else {
    // if entry.users does not have any users, alert user to add users first
    if (entry.value.users.length === 0) {
      alert("Bitte füge zuerst Schüler*innen hinzu.");
      return;
    }
    await createEntryCompetence({ input: { entryId: entry.value.id, competenceId: competence.id } });
  }
}

async function updateCompetenceLevel(data: { id: string; level: number }) {
  await updateEntryUserCompetenceLevel({
    input: { entryId: entry.value.id as string, competenceId: data.id, level: data.level },
  });
}
</script>

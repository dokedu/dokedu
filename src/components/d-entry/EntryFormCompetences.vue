<template>
  <div class="px-8 text-sm">
    <div>
      <header class="mb-2 flex items-center justify-between">
        <div class="text-stone-500">{{ $t("competence", 2) }}</div>
        <div class="rounded-md p-1 hover:bg-stone-100" @click="dialogOpen = true">
          <Plus :size="20" class="stroke-stone-500" />
        </div>
      </header>
      <div class="mb-2 flex flex-col gap-2">
        <d-competence v-for="competence in competences" :key="competence.id" :competence="competence">
          <d-competence-level
            :id="competence.id"
            :level="competence.level"
            :editable="true"
            @update="updateCompetenceLevel"
          />
          <div class="rounded-md p-1 hover:bg-stone-100" @click="toggleCompetence(competence)">
            <X :size="20" class="stroke-stone-500" />
          </div>
        </d-competence>
      </div>
      <div
        class="flex w-fit select-none items-center gap-2 rounded-md p-1 hover:bg-stone-100"
        @click="dialogOpen = true"
      >
        <div class="rounded-md">
          <Plus :size="20" class="stroke-stone-500" />
        </div>
        <span class="pr-2 text-stone-500">{{ $t("add_competence") }}</span>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div
      v-if="dialogOpen"
      ref="dialog"
      class="absolute right-0 top-0 h-screen w-full max-w-xl bg-white shadow-lg backdrop:bg-stone-950/20"
    >
      <div class="flex h-full flex-col p-4">
        <d-competence-search :selected="competences" @add="toggleCompetence" />
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { Plus, X } from "lucide-vue-next";
import { computed, ref, toRef } from "vue";
import { onClickOutside } from "@vueuse/core";
import { onKeyStroke } from "@vueuse/core";
import DCompetenceLevel from "../d-competence-level.vue";
import { Entry, Competence } from "../../gql/graphql.ts";
import DCompetence from "../d-competence/d-competence.vue";
import DCompetenceSearch from "@/components/d-competence-search/d-competence-search.vue";

const dialog = ref(null);
const dialogOpen = ref(false);
const parents = ref<Competence[]>([]);

// on keystroke escape close dialog
onKeyStroke("Escape", () => {
  dialogOpen.value = false;
});

onClickOutside(dialog, () => {
  dialogOpen.value = false;
});

const props = defineProps<{ entry: Partial<Entry> }>();

const entry = toRef(props, "entry");

function updateCompetenceLevel(data: { id: string; level: number }) {
  // find all eacs with eac.competence.id = data.id
  const eacs = entry.value.userCompetences?.filter((eac) => eac.competence.id === data.id);
  // update all eacs with new level
  // @ts-expect-error
  for (const eac of eacs) {
    eac.level = data.level;
  }
}

const competences = computed(() => {
  const items = entry.value.userCompetences?.map((eac) => ({ ...eac.competence, level: eac.level })) || [];
  // return unique items by item.id
  return items.filter((item, index, self) => self.findIndex((t) => t.id === item.id) === index);
});

defineEmits(["toggle"]);

function toggleCompetence(competence: { id: string; type: string }) {
  if (competence.type === "subject" || competence.type === "group") {
    // @ts-expect-error
    parents.value = [...parents.value, competence];
  }

  if (competence.type === "competence") {
    console.log(competence);
  }

  // @ts-expect-error
  emitToggleCompetence(competence);
}

function emitToggleCompetence(competence: Competence) {
  if (competence.type !== "competence") return;

  // if entry.userCompetences is undefined, create empty array
  if (!entry.value.userCompetences) {
    entry.value.userCompetences = [];
  }

  // create new competence and add it to entry.userCompetences if it doesn't exist
  if (!entry.value.userCompetences.map((el) => el.competence.id).includes(competence.id)) {
    // @ts-expect-error
    entry.value.userCompetences.push({ competence: competence, level: competence.level });
  } else {
    // remove competence from entry.userCompetences if it exists
    entry.value.userCompetences = entry.value.userCompetences.filter((el) => el.competence.id !== competence.id);
  }
}
</script>

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
      <div class="flex h-full flex-col">
        <div class="flex h-fit items-center justify-between gap-2 p-4 pb-2">
          <input
            type="text"
            name="search"
            v-model="search"
            id="search"
            :placeholder="$t('search_competences')"
            class="w-full rounded-md border border-stone-200 px-3 py-1.5 text-sm shadow-sm outline-none placeholder:text-stone-400 focus:border-stone-200 focus:ring-0"
          />
          <div class="rounded-md p-1 hover:bg-stone-100" @click="dialogOpen = false">
            <X class="stroke-stone-500" />
          </div>
        </div>
        <div class="flex min-h-fit flex-1 flex-col overflow-auto">
          <div class="mb-2 flex h-6 select-none items-center gap-2 px-4">
            <div class="text-sm text-stone-500 hover:text-stone-900" @click="parents = []">{{ $t("subject", 2) }}</div>
            <div v-if="parents.length > 0" class="text-stone-300">{{ "/" }}</div>
            <div
              v-for="(parent, index) in parents"
              :key="parent.id"
              @click="clickParent(parent)"
              class="flex gap-2 text-sm"
            >
              <div class="text-stone-500 hover:text-stone-900">{{ parent.name }}</div>
              <div class="text-stone-300">{{ index === parents.length - 1 ? "" : "/" }}</div>
            </div>
          </div>
          <div class="flex min-h-fit flex-1 flex-col gap-1 overflow-auto px-4 pb-4">
            <d-competence
              v-for="competence in data?.competences?.edges"
              :key="competence.id"
              :competence="competence"
              @click="toggleCompetence(competence)"
            >
            </d-competence>
          </div>
          <div v-if="!data?.competences?.edges" class="select-none text-center text-sm uppercase text-stone-500">
            {{ $t("no_results") }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { Plus, X } from "lucide-vue-next";
import { computed, ref, toRef } from "vue";
import { gql, useQuery } from "@urql/vue";
import { onClickOutside } from "@vueuse/core";
import { onKeyStroke } from "@vueuse/core";
import DCompetenceLevel from "../../../components/d-competence-level.vue";
import { Entry, Competence } from "../../../gql/graphql";
import DCompetence from "../../../components/d-competence/d-competence.vue";

const dialog = ref(null);
const dialogOpen = ref(false);
const search = ref("");
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

const filter = computed(() => {
  if (parents.value.length > 0) {
    return {
      type: ["group", "competence"],
      parents: [parents.value[parents.value.length - 1].id],
    };
  } else {
    return {
      type: ["subject"],
    };
  }
});

defineEmits(["toggle"]);

const { data } = useQuery({
  query: gql`
    query competences($search: String, $filter: CompetenceFilterInput) {
      competences(search: $search, filter: $filter, sort: { field: sort_order, order: asc }) {
        edges {
          id
          name
          type
          color
          grades
          parents {
            id
            name
            type
            grades
          }
        }
      }
    }
  `,
  variables: {
    search,
    filter,
  },
});

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

// @ts-expect-error
function highlightText(text: string) {
  if (search.value.length === 0) {
    return text;
  }

  const regex = new RegExp(search.value, "gi");
  const match = text.match(regex);

  if (!match) {
    return text;
  }

  return text.replace(regex, (match) => {
    return `<span class="bg-yellow-200">${match}</span>`;
  });
}

function clickParent(parent: Competence) {
  // find parent and remove all items after parents index
  const index = parents.value.findIndex((item) => item.id === parent.id);

  console.log(index);

  if (index === -1) {
    return;
  }
  if (index === parents.value.length - 1) {
    return;
  }
  if (index === 0) {
    parents.value = [];
    return;
  }

  parents.value.splice(index + 1);
}
</script>

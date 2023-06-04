<template>
  <div class="px-8">
    <div>
      <header class="mb-2 flex items-center justify-between">
        <div class="text-gray-500">Competences</div>
        <div class="rounded-md p-1 hover:bg-gray-100" @click="dialogOpen = true">
          <Plus :size="20" class="stroke-gray-500" />
        </div>
      </header>
      <div class="mb-2">
        <div
          v-for="competence in competences"
          class="flex w-full select-none items-center justify-between gap-2 rounded-lg px-1 py-1 text-gray-700 hover:bg-gray-50"
        >
          <div class="flex items-center gap-2">
            <span>{{ competence.name }}</span>
          </div>
          <div class="rounded-md p-1 hover:bg-gray-100" @click="toggleCompetence(competence)">
            <X :size="20" class="stroke-gray-500" />
          </div>
        </div>
      </div>
      <div
        class="flex w-fit select-none items-center gap-2 rounded-md p-1 hover:bg-gray-100"
        @click="dialogOpen = true"
      >
        <div class="rounded-md">
          <Plus :size="20" class="stroke-gray-500" />
        </div>
        <span class="pr-2 text-gray-500">Add competence</span>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div
      v-if="dialogOpen"
      ref="dialog"
      class="absolute right-0 top-0 h-screen w-full max-w-xl bg-white p-4 shadow-lg backdrop:bg-gray-950/20"
    >
      <div class="mb-4 flex items-center justify-between gap-2">
        <input
          type="text"
          name="search"
          v-model="search"
          id="search"
          placeholder="Search competences"
          class="w-full rounded-md border border-gray-200 px-3 py-1.5 shadow-sm outline-none placeholder:text-gray-400 focus:border-gray-200 focus:ring-0"
        />
        <div class="rounded-md p-1 hover:bg-gray-100" @click="dialogOpen = false">
          <X class="stroke-gray-500" />
        </div>
      </div>
      <div>
        <div class="mb-2 flex h-6 select-none items-center gap-2">
          <div></div>
          <div class="text-sm text-gray-500 hover:text-gray-900" @click="parents = []">Subjects</div>
          <div v-if="parents.length > 0" class="text-gray-300">{{ "/" }}</div>
          <div
            v-for="(parent, index) in parents"
            :key="parent.id"
            @click="clickParent(parent)"
            class="flex gap-2 text-sm"
          >
            <div class="text-gray-500 hover:text-gray-900">{{ parent.name }}</div>
            <div class="text-gray-300">{{ index === parents.length - 1 ? "" : "/" }}</div>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div
            v-for="competence in data?.competences?.edges"
            class="flex w-full select-none justify-between rounded-lg px-2 py-1 text-gray-700 hover:bg-gray-50"
            @click="toggleCompetence(competence)"
          >
            <div
              :class="{ 'text-blue-700': eacs.map((el) => el.competence.id).includes(competence.id) }"
              v-html="highlightText(competence.name)"
            ></div>
            <div>
              {{ competence.type }}
              {{ competence.grades }}
            </div>
          </div>
        </div>
        <div v-if="!data?.competences?.edges" class="select-none text-center text-sm uppercase text-gray-500">
          no results
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
import internal from "stream";

const dialog = ref(null);
const dialogOpen = ref(false);
const search = ref("");
const parents = ref([]);

// on keystroke escape close dialog
onKeyStroke("Escape", () => {
  dialogOpen.value = false;
});

onClickOutside(dialog, () => {
  dialogOpen.value = false;
});

const props = defineProps({
  eacs: {
    type: Array,
    default: () => [],
  },
});

const competences = computed(() => {
  const items = props.eacs?.map((eac) => eac.competence);
  // return unique items by item.id
  return items?.filter((item, index) => items?.findIndex((el) => el.id === item.id) === index);
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

const emit = defineEmits(["toggle"]);

const { data } = useQuery({
  query: gql`
    query competences($search: String, $filter: CompetenceFilterInput) {
      competences(search: $search, filter: $filter) {
        edges {
          id
          name
          type
          color
          grades
        }
      }
    }
  `,
  variables: {
    search,
    filter,
  },
});

function toggleEAC(eac: { id: string; competence: { id: string; type: string }; user: { id: string } }) {
  // if (eac.competence.type !== "competence") return;

  emit("toggle", eac.competence);
}

function toggleCompetence(competence: { id: string; type: string }) {
  if (competence.type === "subject" || competence.type === "group") {
    parents.value = [...parents.value, competence];
  }

  if (competence.type === "competence") {
    console.log(competence);
  }

  emit("toggle", competence);
}

function highlightText(text) {
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

function clickParent(parent) {
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

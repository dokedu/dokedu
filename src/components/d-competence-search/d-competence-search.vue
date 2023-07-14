<template>
  <div class="flex h-full w-full select-none flex-col gap-4 text-sm">
    <header class="flex min-h-0 w-full flex-col gap-1">
      <input
        v-model="search"
        class="w-full rounded-md border border-stone-200 px-3 py-1.5 text-sm text-strong placeholder:text-subtle"
        type="text"
        autocomplete="off"
        :placeholder="$t('search_competences')"
      />
      <div class="flex flex-wrap gap-1 px-1 pt-1 text-subtle">
        <div @click="parentId = null">Fächer</div>
        <template v-for="parent in parentPath">
          <div>{{ ">" }}</div>
          <div @click="parentId = parent.id">{{ parent.name }}</div>
        </template>
      </div>
    </header>
    <div class="flex h-full flex-col gap-1 overflow-scroll">
      <d-competence
        v-for="competence in competences"
        :key="competence?.id"
        :competence="(competence as Competence)"
        @click="onClick(competence)"
        :class="{
          'border-blue-200 bg-blue-50': selected.some((s) => s.id === competence?.id),
        }"
      />
      <div v-if="competences.length === 0">
        <div class="flex h-full items-center justify-center text-stone-500">No competences found</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import DCompetence from "@/components/d-competence/d-competence.vue";
import { computed, reactive, ref } from "vue";
import { Competence } from "@/gql/graphql";

defineProps({
  selected: {
    type: Array as () => { id: string }[],
    default: () => [],
  },
});

const search = ref("");
const parentId = ref<string | null>(null);
const parents = computed(() => {
  if (!parentId.value) return [];
  return [parentId.value];
});

const filter = computed(() => {
  const searchLength = search.value.length;
  const hasParent = !!parentId.value;
  if (!hasParent && searchLength === 0) return { type: "subject" };
  if (!hasParent && searchLength > 0) return { type: ["competence", "group"] };
  return { parents: parents.value };
});

const { data: competenceData } = useQuery({
  query: graphql(`
    query competenceSearch($search: String, $filter: CompetenceFilterInput) {
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
            color
          }
        }
      }
    }
  `),
  // @ts-ignore
  variables: reactive({
    search,
    filter,
  }),
});

const { data: parentData } = useQuery({
  query: graphql(`
    query competencePath($id: ID!) {
      competence(id: $id) {
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
          color
        }
      }
    }
  `),
  variables: {
    // @ts-ignore
    id: parentId,
  },
  pause: computed(() => !parentId.value),
});

const parentPath = computed(() => {
  if (!parentId.value) return [];
  if (!parentData.value?.competence?.parents) return [];
  return [...parentData.value.competence.parents, parentData.value.competence];
});

const competences = computed(() => {
  if (!competenceData.value?.competences?.edges) return [];
  return competenceData.value.competences.edges;
});

const emit = defineEmits(["add"]);

function onClick(competence: any) {
  if (competence.type !== "competence") {
    parentId.value = competence.id;
  } else {
    emit("add", competence);
  }
}
</script>

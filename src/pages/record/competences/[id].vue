<template>
  <PageWrapper>
    <PageHeader class="flex select-none justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-neutral-950">
          <router-link :to="{ name: '/record/competences/' }"> {{ $t("competence", 2) }}</router-link>
        </div>
        <input
          v-model="search"
          type="text"
          name="search"
          id="search"
          :placeholder="$t('search')"
          class="h-8 rounded-md border border-neutral-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-neutral-200 focus:shadow-sm focus:ring-0"
        />
      </div>
    </PageHeader>
    <div
      v-if="breadcrumbs.length > 0"
      class="flex select-none flex-wrap items-center gap-1 px-7 py-2 text-sm text-neutral-700"
    >
      <router-link class="rounded-lg px-1.5 py-0.5 hover:bg-neutral-100" :to="{ name: '/record/competences/' }">
        Fächer
      </router-link>
      <template v-for="parent in breadcrumbs" :key="parent.id">
        <span>/</span>
        <router-link
          :to="{ name: '/record/competences/[id]', params: { id: parent.id } }"
          class="rounded-lg px-1.5 py-0.5 hover:bg-neutral-100"
        >
          {{ parent.name }}
        </router-link>
      </template>
    </div>
    <DTable
      :query="competenceQuery"
      :columns="columns"
      hideHeader
      objectName="competences"
      v-model:variables="pageVariables"
      @row-click="goToCompetence"
      :search="search"
    >
      <template #name-data="{ item }">
        <div class="flex items-center gap-2">
          <Folder v-if="item.type !== 'competence'" :size="16" class="fill-neutral-700 stroke-neutral-700" />
          <div>{{ item.name }}</div>
        </div>
      </template>
      <template #grade-data="{ item }">
        <div class="flex w-full justify-end text-right">{{ grades(item) }}</div>
      </template>
    </DTable>
  </PageWrapper>
  <router-view />
</template>

<script setup lang="ts">
import PageHeader from "@/components/page-header.vue";
import PageWrapper from "@/components/page-wrapper.vue";
import { graphql } from "@/gql";
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router/auto";
import DTable from "@/components/d-table/d-table.vue";
import { watchDebounced } from "@vueuse/core";
import type { PageVariables } from "@/types/types.ts";
import { Competence } from "@/gql/graphql";
import { Folder } from "lucide-vue-next";
import { useQuery } from "@urql/vue";

const route = useRoute<"/record/competences/[id]">();
const router = useRouter();

const search = ref("");

const id = computed(() => route.params.id as string);

interface Variables extends PageVariables {}

const pageVariables = ref<Variables[]>([
  {
    search: "",
    limit: 50,
    offset: 0,
    filter: { parents: id.value },
    nextPage: undefined,
  },
]);

watchDebounced(
  search,
  () => {
    pageVariables.value = [
      {
        search: search.value,
        limit: 50,
        offset: 0,
        filter: { parents: id.value },
        nextPage: undefined,
      },
    ];
  },
  { debounce: 250, maxWait: 500 },
);

// To ensure the router view updates
watch(id, () => {
  pageVariables.value = [
    {
      search: "",
      limit: 50,
      offset: 0,
      filter: { parents: id.value },
      nextPage: undefined,
    },
  ];
});

const columns = [
  {
    key: "name",
    label: "name",
    width: 0.8,
  },
  {
    key: "grade",
    label: "grade",
  },
];

function grades(competence: Competence) {
  // return first and last grade and if only one grade only that one as string
  if (competence.grades.length === 1) {
    return competence.grades[0].toString();
  }

  const sorted = competence.grades.sort((a, b) => a - b);

  return `${sorted[0]} - ${sorted[sorted.length - 1]}`;
}

function goToCompetence<Type extends { id: string; type: string }>(row: Type) {
  if (row.type === "competence") return;
  router.push({ name: "/record/competences/[id]", params: { id: row.id } });
}

const competenceQuery = graphql(`
  query competence($search: String, $limit: Int, $offset: Int, $filter: CompetenceFilterInput) {
    competences(
      filter: $filter
      search: $search
      limit: $limit
      offset: $offset
      sort: { field: sort_order, order: asc }
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        id
        name
        type
        grades
        color
        sortOrder
        parents {
          id
          name
          type
          grades
        }
      }
    }
  }
`);

const { data: parents } = useQuery({
  query: graphql(`
    query zeCompetenceParents($id: ID!) {
      competence(id: $id) {
        id
        name
        type
        grades
        parents {
          id
          name
          type
          grades
        }
      }
    }
  `),
  variables: reactive({ id: id }),
});

const breadcrumbs = computed(() => {
  if (!parents.value?.competence) return [];
  return [...parents.value.competence.parents, parents.value.competence];
});
</script>

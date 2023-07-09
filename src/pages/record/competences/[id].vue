<template>
  <PageWrapper>
    <PageHeader class="flex select-none justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">
          <router-link :to="{ name: 'record-competences' }"> {{ $t("competence", 2) }}</router-link>
        </div>
        <input
          v-model="search"
          type="text"
          name="search"
          id="search"
          :placeholder="$t('search')"
          class="h-8 rounded-md border border-stone-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-stone-200 focus:shadow-sm focus:ring-0"
        />
      </div>
    </PageHeader>
    <DTable
      :query="competenceQuery"
      :columns="columns"
      hideHeader
      objectName="competences"
      v-model:variables="pageVariables"
      @row-click="goToCompetence"
      :search="search"
    >
      <template #grade-data="{ item }">
        <div class="flex w-full justify-end text-right">{{ grades(item) }}</div>
      </template>
    </DTable>
  </PageWrapper>
  <router-view />
</template>
<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import { graphql } from "@/gql";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import DTable from "@/components/d-table/d-table.vue";
import { watchDebounced } from "@vueuse/core";
import { PageVariables } from "@/types/types";
import { Competence } from "@/gql/graphql";

const search = ref("");
const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.id as string);

interface Variables extends PageVariables {
  parent: string[];
}

const pageVariables = ref<Variables[]>([
  {
    search: "",
    limit: 50,
    offset: 0,
    parent: [id.value],
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
        nextPage: undefined,
        parent: [id.value],
      },
    ];
  },
  { debounce: 250, maxWait: 500 }
);

// To ensure the router view updates
watch(id, () => {
  pageVariables.value = [
    {
      search: "",
      limit: 50,
      offset: 0,
      parent: [id.value],
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
  return `${competence.grades[0]} - ${competence.grades[competence.grades.length - 1]}`;
}

function goToCompetence<Type extends { id: string; type: string }>(row: Type) {
  if (row.type === "competence") return;
  router.push({ name: "record-competences-competence", params: { id: row.id } });
}

const competenceQuery = graphql(`
  query competence($search: String, $limit: Int, $offset: Int, $parent: [ID]) {
    competences(
      filter: { parents: $parent }
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
</script>

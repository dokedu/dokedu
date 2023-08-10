<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">{{ $t("competence", 2) }}</div>
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
      :columns="columns"
      :query="competencesQuery"
      v-model:variables="pageVariables"
      objectName="competences"
      hideHeader
      :watchers="[search]"
      :search="search"
      @row-click="goToCompetence"
    >
      <template #name-data="{ item }">
        <Folder v-if="item.type !== 'competence'" :size="16" class="fill-stone-700 stroke-stone-700" />
        <DTag :color="item.color">{{ item.name }}</DTag>
      </template>
      <template #grade-data="{ item }">
        <div class="flex w-full items-center justify-end gap-2 text-right">
          <div class="rounded-lg p-1 hover:bg-stone-200" @click.stop="editCompetence(item)">
            <Edit2 :size="16" class="stroke-stone-700" />
          </div>
          <div>
            {{ grades(item) }}
          </div>
        </div>
      </template>
    </DTable>
  </PageWrapper>
  <router-view />
  <div v-if="competence">
    <DCompetenceEditDialog :competence="competence" @close="competence = null" />
  </div>
</template>
<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import { graphql } from "@/gql";
import { ref } from "vue";
import { Edit2, Folder } from "lucide-vue-next";
import DCompetenceEditDialog from "@/components/DCompetenceEditDialog.vue";
import { Competence } from "@/gql/graphql";
import DTag from "@/components/d-tag/d-tag.vue";
import DTable from "@/components/d-table/d-table.vue";
import { useRouter } from "vue-router/auto";
import { watchDebounced } from "@vueuse/core";
import type { PageVariables } from "@/types/types";

const search = ref("");
const competence = ref<Competence | null>(null);
const router = useRouter();

const pageVariables = ref<PageVariables[]>([
  {
    limit: 100,
    offset: 0,
    search: "",
    nextPage: undefined,
  },
]);

watchDebounced(
  search,
  () => {
    pageVariables.value = [
      {
        search: search.value,
        limit: 100,
        offset: 0,
        nextPage: undefined,
      },
    ];
  },
  { debounce: 250, maxWait: 500 }
);

const columns = [
  {
    label: "name",
    key: "name",
    width: 0.8,
  },
  {
    label: "grade",
    key: "grade",
  },
];

function editCompetence(value: Competence) {
  competence.value = value;
}

function grades(competence: Competence) {
  // return first and last grade and if only one grade only that one as string
  if (competence.grades.length === 1) {
    return competence.grades[0].toString();
  }

  const sorted = competence.grades.sort((a, b) => a - b);

  return `${sorted[0]} - ${sorted[sorted.length - 1]}`;
}

const competencesQuery = graphql(`
  query competenceSubjects($search: String, $limit: Int, $offset: Int) {
    competences(
      filter: { type: subject }
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

const goToCompetence = <Type extends { id: string }>(row: Type) => {
  router.push({
    name: "/record/competences/[id]",
    params: {
      id: row.id,
    },
  });
};
</script>

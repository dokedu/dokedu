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
    <PageContent>
      <div class="flexflex-col select-none overflow-scroll" ref="sortable">
        <component
          v-for="competence in data?.competence?.competences"
          :key="competence?.id"
          :to="{ name: 'record-competences-competence', params: { id: competence?.id } }"
          :is="competence && competence.type !== 'competence' ? 'router-link' : 'div'"
          class="flex justify-between border-b border-stone-100 text-sm transition-all hover:bg-stone-50"
          :class="{
            '!bg-stone-100': competence?.id === $route.params.id,
          }"
        >
          <div class="p-2 pl-8 text-strong">{{ competence?.name }}</div>
          <div class="p-2 pr-8 text-strong">{{ grades(competence) }}</div>
        </component>
      </div>
    </PageContent>
  </PageWrapper>
  <router-view />
</template>
<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import PageContent from "@/components/PageContent.vue";
import { useMutation, useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useSortable } from "@vueuse/integrations/useSortable";

const sortable = ref<HTMLElement | null>(null);
const search = ref("");
const route = useRoute();

const id = computed(() => route.params.id as string);

const competences = computed({
  get: () => data.value?.competence.competences || [],
  set: (value) => {
    // @ts-expect-error
    data.value = value;
  },
});

useSortable(sortable, competences, {
  onUpdate: (e: { oldIndex: number; newIndex: number }) => {
    competences.value.splice(e.newIndex, 0, competences.value.splice(e.oldIndex, 1)[0]);
    for (let i = 0; i < competences.value.length; i++) {
      // @ts-expect-error
      competences.value[i].sortOrder = i;
    }
    updateCompetenceOrder();
  },
});

async function updateCompetenceOrder() {
  // get all ids and their sort order by using their current index
  const ids = competences.value.map((competence: any, index: number) => ({
    id: competence.id,
    sortOrder: index,
  }));

  // update the sort order of all competences
  await updateCompetenceSorting({
    input: {
      competences: ids,
    },
  });
}

const { executeMutation: updateCompetenceSorting } = useMutation(
  graphql(`
    mutation updateCompetenceSorting($input: UpdateCompetenceSortingInput!) {
      updateCompetenceSorting(input: $input) {
        id
        name
        type
        grades
        color
        sortOrder
      }
    }
  `)
);

// @ts-expect-error
function grades(competence: Competence) {
  // return first and last grade and if only one grade only that one as string
  if (competence.grades.length === 1) {
    return competence.grades[0].toString();
  }
  return `${competence.grades[0]} - ${competence.grades[competence.grades.length - 1]}`;
}

const { data } = useQuery({
  query: graphql(`
    query competence($id: ID!, $search: String) {
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
        competences(search: $search) {
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
    }
  `),
  variables: reactive({
    id,
    search: search,
  }),
});
</script>

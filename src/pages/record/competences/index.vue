<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">Competences</div>
        <input
          v-model="search"
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          class="h-8 rounded-md border border-stone-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-stone-200 focus:shadow-sm focus:ring-0"
        />
      </div>
    </PageHeader>
    <PageContent>
      <div class="flex flex-col overflow-scroll">
        <router-link
          :to="{ name: 'record-competences-competence', params: { id: competence.id } }"
          v-for="competence in data?.competences?.edges"
          class="flex justify-between border-b text-sm transition-all hover:bg-stone-50"
          :class="{
            '!bg-stone-100': competence?.id === $route.params.id,
          }"
        >
          <div class="p-2 pl-8 text-strong">{{ competence.name }}</div>
          <div class="p-2 pr-8 text-strong">{{ grades(competence) }}</div>
        </router-link>
      </div>
    </PageContent>
  </PageWrapper>
  <router-view />
</template>
<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import PageContent from "@/components/PageContent.vue";
import dCompetence from "@/components/d-competence/d-competence.vue";
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import { reactive, ref } from "vue";

const search = ref("");

function grades(competence: Competence) {
  // return first and last grade and if only one grade only that one as string
  if (competence.grades.length === 1) {
    return competence.grades[0].toString();
  }
  return `${competence.grades[0]} - ${competence.grades[competence.grades.length - 1]}`;
}

const { data } = useQuery({
  query: graphql(`
    query competenceSubjects($filter: CompetenceFilterInput, $search: String) {
      competences(filter: $filter, search: $search) {
        edges {
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
    filter: {
      type: "subject",
    },
    search: search,
  }),
});
</script>

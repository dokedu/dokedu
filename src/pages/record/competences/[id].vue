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
      <div class="flexflex-col select-none overflow-scroll">
        <component
          v-for="competence in data?.competence?.competences"
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
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

const search = ref("");
const route = useRoute();

const id = computed(() => route.params.id as string);

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

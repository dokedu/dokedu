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
    <PageContent>
      <div class="flex flex-col overflow-scroll">
        <router-link
          :to="{ name: 'record-competences-competence', params: { id: competence?.id } }"
          v-for="competence in data?.competences?.edges as Competence[]"
          class="flex justify-between border-b border-stone-100 text-sm transition-all hover:bg-stone-50"
          :class="{
            '!bg-stone-100': competence?.id === $route.params.id,
          }"
        >
          <div class="p-2 pl-8 text-strong">
            <DTag :color="competence.color">{{ competence?.name }}</DTag>
          </div>
          <div class="flex items-center gap-2">
            <div class="rounded-lg p-1 hover:bg-stone-200" @click.prevent="editCompetence(competence)">
              <Edit2 :size="16" class="stroke-stone-700" />
            </div>
            <div class="p-2 pr-8 text-strong">{{ grades(competence) }}</div>
          </div>
        </router-link>
      </div>
    </PageContent>
  </PageWrapper>
  <router-view />
  <div v-if="competence">
    <DCompetenceEditDialog :competence="competence" @close="competence = null" />
  </div>
</template>
<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import PageContent from "@/components/PageContent.vue";
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import { reactive, ref } from "vue";
import { Edit2 } from "lucide-vue-next";
import DCompetenceEditDialog from "./DCompetenceEditDialog.vue";
import { Competence } from "@/gql/graphql";
import DTag from "@/components/d-tag/d-tag.vue";

const search = ref("");
const competence = ref<Competence | null>(null);

function editCompetence(value: Competence) {
  competence.value = value;
}

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
      competences(filter: $filter, search: $search, limit: 100) {
        edges {
          id
          name
          type
          grades
          color
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
  // @ts-expect-error
  variables: reactive({
    filter: {
      type: "subject",
    },
    search: search,
  }),
});
</script>

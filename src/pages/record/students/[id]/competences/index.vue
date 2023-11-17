<template>
  <div>
    <div class="mb-4 flex gap-2 text-sm text-subtle">
      <div>{{ $t("subject", 2) }}</div>
    </div>
    <div class="flex flex-col gap-2">
      <RouterLink v-for="competence in data?.competences?.edges"
        :to="{ name: '/record/students/[id]/competences/[cid]', params: { id: route.params.id, cid: competence?.id as string } }">
        <DCompetence v-if="competence" :competence="(competence as Competence)"></DCompetence>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import DCompetence from "@/components/d-competence/d-competence.vue";
import { Competence } from "@/gql/graphql";
import { useRoute } from "vue-router/auto";
import { reactive } from "vue";

const route = useRoute("/record/students/[id]/competences/");

const { data } = useQuery({
  query: graphql(`
    query studentCompetences($userId: ID!) {
      competences(filter: { type: subject }, limit: 100, sort: { field: sort_order, order: asc }) {
        edges {
          id
          name
          grades
          tendency(userId: $userId) {
            tendency
            countChildCompetences
            countLearnedCompetences
          }
        }
      }
    }
  `),
  variables: reactive({
    userId: route.params.id,
  }),
});
</script>

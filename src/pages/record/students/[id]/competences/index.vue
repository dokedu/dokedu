<template>
  <div class="flex flex-col gap-2">
    <RouterLink
      v-for="competence in data?.competences?.edges"
      :to="{ name: 'record-students-student-competences-competence', params: { subject: competence?.id } }"
    >
      <DCompetence v-if="competence" :competence="competence"> </DCompetence>
    </RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import DCompetence from "@/components/d-competence/d-competence.vue";

const { data } = useQuery({
  query: graphql(`
    query studentCompetences {
      competences(filter: { type: subject }) {
        edges {
          id
          name
          grades
        }
      }
    }
  `),
});
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="mb-4 flex gap-2 min-h-0 text-sm text-subtle px-6 pt-4">
      <div>{{ $t("subject", 2) }}</div>
    </div>
    <div class="flex flex-col flex-1 gap-2 overflow-auto px-6 pb-4">
      <RouterLink
        v-for="competence in data?.competences?.edges"
        :to="{
          name: '/record/students/[id]/competences/[cid]',
          params: { id: route.params.id, cid: competence?.id as string },
        }"
      >
        <DCompetence v-if="competence" :competence="competence as Competence" />
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DCompetence from "@/components/d-competence/d-competence.vue";
import { Competence } from "@/gql/schema.ts";
import { useRoute } from "vue-router/auto";
import { reactive } from "vue";
import { useStudentCompetencesQuery } from "@/gql/queries/competences/studentCompetences.ts";

const route = useRoute("/record/students/[id]/competences/");

const { data } = useStudentCompetencesQuery({
  variables: reactive({
    userId: route.params.id as unknown as string,
  }),
});
</script>

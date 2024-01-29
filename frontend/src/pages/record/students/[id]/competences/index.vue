<template>
  <div class="flex flex-col h-full">
    <div class="mb-2 flex gap-2 min-h-0 text-sm text-subtle px-6 pt-4">
      <div>{{ $t("subject", 2) }}</div>
    </div>
    <div class="flex flex-col flex-1 gap-2 overflow-auto px-6 pb-4 divide-y">
      <RouterLink
        v-for="competence in data?.competences?.edges"
        :key="competence?.id"
        :to="{
          name: '/record/students/[id]/competences/[cid]',
          params: { id: route.params.id, cid: competence?.id as string }
        }"
        class="pt-2"
      >
        <DCompetence
          class="border-0 hover:bg-neutral-100 rounded-md"
          v-if="competence"
          :competence="competence as Competence"
        />
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DCompetence from "@/components/d-competence/d-competence.vue"
import type { Competence } from "@/gql/schema"
import { useRoute } from "vue-router/auto"
import { reactive } from "vue"
import { useStudentCompetencesQuery } from "@/gql/queries/competences/studentCompetences"

const route = useRoute("/record/students/[id]/competences/")

const { data } = useStudentCompetencesQuery({
  variables: reactive({
    userId: route.params.id as unknown as string
  })
})
</script>

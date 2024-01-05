<template>
  <div class="flex h-full flex-col">
    <div class="mb-4 flex h-fit gap-2 text-sm text-subtle px-6 pt-4">
      <router-link :to="{ name: '/record/students/[id]/competences/' }">{{ $t("subject", 2) }}</router-link>
      <template v-for="parent in data?.competence.parents">
        <span>{{ ">" }}</span>
        <router-link
          :to="{ name: '/record/students/[id]/competences/[cid]', params: { id: route.params.id, cid: parent?.id } }">
          {{ parent.name }}
        </router-link>
      </template>
      <span>{{ ">" }}</span>
      <router-link :to="{
        name: '/record/students/[id]/competences/[cid]',
        params: { id: route.params.id, cid: data?.competence?.id as string }
      }">
        {{ data?.competence.name }}
      </router-link>
    </div>

    <div class="flex flex-1 flex-col gap-2 overflow-auto px-6 pb-4">
      <component v-for="competence in data?.competence?.competences as Competence[]"
        :is="competence?.type !== 'competence' ? 'router-link' : 'div'" :to="{
          name: '/record/students/[id]/competences/[cid]',
          params: { id: route.params.id, cid: competence?.id }
        }">
        <DCompetence v-if="competence" :competence="competence">
          <DCompetenceLevel :id="competence.userCompetences[0]?.id as string" :level="getLevel(competence)"
            :editable="competence.type != 'subject'"
            @update="(val) => createUserCompetence({ level: val.level, id: competence.id })" class="z-10" />
          <template #footer>
            <div v-if="competence.userCompetences.length > 0">
              <DCompetenceEntries :competences="competence.userCompetences as UserCompetence[]" />
            </div>
          </template>
        </DCompetence>
      </component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router/auto"
import { computed, reactive } from "vue"
import DCompetence from "@/components/d-competence/d-competence.vue"
import DCompetenceLevel from "@/components/d-competence/d-competence-level.vue"
import DCompetenceEntries from "@/components/d-competence/d-competence-entries.vue"
import type { Competence, UserCompetence } from "@/gql/schema"
import { useStudentCompetenceQuery } from "@/gql/queries/competences/studentCompetence"
import { useCreateUserCompetenceMutation } from "@/gql/mutations/userCompetences/createUserCompetence"

const route = computed(() => useRoute("/record/students/[id]/competences/[cid]"))
const competenceId = computed(() => route.value.params.cid as string)
const id = computed(() => route.value.params.id as string)

const getLevel = (competence: Competence) => {
  if (competence.userCompetences != null && competence.userCompetences?.length === 0) {
    return 0
  }

  // @ts-expect-error
  return competence?.userCompetences[0].level || 0
}

const { data, executeQuery: fetchCompetence } = useStudentCompetenceQuery({
  variables: reactive({ competenceId, user: id })
})

const { executeMutation: createUserCompetenceMutation } = useCreateUserCompetenceMutation()

async function createUserCompetence(input: { id: string; level: number }) {
  await createUserCompetenceMutation({
    input: {
      competenceId: input.id,
      level: input.level,
      userId: id.value
    }
  })

  await fetchCompetence()
}
</script>

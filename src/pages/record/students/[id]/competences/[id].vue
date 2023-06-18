<template>
  <div class="flex h-full flex-col">
    <div class="mb-4 flex h-fit gap-2 text-sm text-subtle">
      <router-link :to="{ name: 'record-students-student-competences' }">Fächer</router-link>
      <template v-for="parent in data?.competence.parents">
        <span>{{ ">" }}</span>
        <router-link :to="{ name: 'record-students-student-competences-competence', params: { subject: parent?.id } }">
          {{ parent.name }}
        </router-link>
      </template>
      <span>{{ ">" }}</span>
      <router-link
        :to="{ name: 'record-students-student-competences-competence', params: { subject: data?.competence?.id } }"
      >
        {{ data?.competence.name }}
      </router-link>
    </div>
    <div class="h-full max-h-full overflow-auto">
      <div class="flex h-full min-h-fit flex-1 flex-col gap-2 overflow-auto">
        <component
          v-for="competence in (data?.competence?.competences as Competence[])"
          :is="competence?.type !== 'competence' ? 'router-link' : 'div'"
          :to="{ name: 'record-students-student-competences-competence', params: { subject: competence?.id } }"
        >
          <DCompetence v-if="competence" :competence="competence">
            <DCompetenceLevel
              :id="competence.userCompetences[0]?.id as string"
              :level="getLevel(competence)"
              :editable="competence.type == 'subject' ? false : true"
              @update="(val) => createUserCompetence({ level: val.level, id: competence.id })"
            ></DCompetenceLevel>
            <template #footer>
              <div v-if="competence.userCompetences.length > 0">
                <DCompetenceEntries
                  :competences="(competence.userCompetences as UserCompetence[])"
                ></DCompetenceEntries>
              </div>
            </template>
          </DCompetence>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuery, useMutation } from "@urql/vue";
import { graphql } from "../../../../../gql";
import { useRoute } from "vue-router";
import { computed, reactive } from "vue";
import DCompetence from "@/components/d-competence/d-competence.vue";
import DCompetenceLevel from "@/components/d-competence-level.vue";
import DCompetenceEntries from "@/components/d-competence-entries.vue";
import { Competence, UserCompetence } from "@/gql/graphql";

const route = computed(() => useRoute());
const competenceId = computed(() => route.value.params.subject as string);
const id = computed(() => route.value.params.id as string);

const getLevel = (competence: Competence) => {
  if (competence.userCompetences != null && competence.userCompetences?.length === 0) {
    return 0;
  }

  // @ts-expect-error
  return competence?.userCompetences[0].level || 0;
};

const { data, executeQuery: fetchCompetence } = useQuery({
  query: graphql(`
    query studentCompetence($competenceId: ID!, $user: ID!) {
      competence(id: $competenceId) {
        id
        name
        parents {
          id
          name
        }
        competences {
          type
          id
          name
          grades
          parents {
            id
            name
          }
          userCompetences(userId: $user) {
            id
            level
            entry {
              id
            }
            createdBy {
              firstName
              lastName
            }
            createdAt
          }
        }
      }
    }
  `),
  variables: reactive({ competenceId, user: id }),
});

const { executeMutation: createUserCompetenceMutation } = useMutation(
  graphql(`
    mutation createUserCompetence($input: CreateUserCompetenceInput!) {
      createUserCompetence(input: $input) {
        id
        level
      }
    }
  `)
);

async function createUserCompetence(input: { id: string; level: number }) {
  await createUserCompetenceMutation({
    input: {
      competenceId: input.id,
      level: input.level,
      userId: id.value,
    },
  });

  await fetchCompetence();
}
</script>

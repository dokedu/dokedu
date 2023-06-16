<template>
  <div class="flex flex-col">
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
    <div class="flex min-h-fit flex-1 flex-col gap-2 overflow-auto">
      <component
        v-for="competence in data?.competence?.competences"
        :is="competence?.type !== 'competence' ? 'router-link' : 'div'"
        :to="{ name: 'record-students-student-competences-competence', params: { subject: competence?.id } }"
      >
        <DCompetence v-if="competence" :competence="competence">
          <DCompetenceLevel
            :id="competence.userCompetences[0]?.id"
            :level="getLevel(competence)"
            :editable="competence.type == 'subject' ? false : true"
            @update="(val) => createUserCompetence({ level: val.level, id: competence.id })"
          ></DCompetenceLevel>
          <template #footer>
            <div v-if="competence.userCompetences.length > 0">
              <DCompetenceEntries :competences="competence.userCompetences"></DCompetenceEntries>
            </div>
          </template>
        </DCompetence>
      </component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuery, useMutation } from "@urql/vue";
import { graphql } from "../../../../../gql";
import { useRoute } from "vue-router";
import { computed, reactive, ref } from "vue";
import DCompetence from "@/components/d-competence/d-competence.vue";
import DCompetenceLevel from "@/components/d-competence-level.vue";
import DCompetenceEntries from "@/components/d-competence-entries.vue";
import { Competence } from "@/gql/graphql";

const route = computed(() => useRoute());
const competenceId = computed(() => route.value.params.subject as string);
const id = computed(() => route.value.params.id as string);

type StudentCompetence = {
  __typename?: "Competence" | undefined;
  id: string;
  name: string;
  grades: number[];
  userCompetences: ({
    __typename?: "UserCompetence" | undefined;
    id: string;
    level: number;
  } | null)[];
};

const getLevel = (competence: StudentCompetence | Partial<Competence>) => {
  if (competence.userCompetences != null && competence.userCompetences?.length === 0) {
    return 0;
  }

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

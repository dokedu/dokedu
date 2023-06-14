<template>
  <div class="flex flex-col gap-2">
    <component
      :is="competence.competences.length > 0 ? 'router-link' : 'div'"
      v-for="competence in data?.competence?.competences"
      :to="{ name: 'record-students-student-competences-competence', params: { subject: competence?.id } }"
    >
      <DCompetence v-if="competence" :competence="competence">
        <DCompetenceLevel
          v-if="competence.userCompetences.length > 0"
          :id="competence.userCompetences[0].id"
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
import { reactiveComputed } from "@vueuse/core";

const route = computed(() => useRoute());
const subject = computed(() => route.value.params.subject as string);
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

const { data } = useQuery({
  query: graphql(`
    query subjectCompetences($subject: ID!, $user: ID!) {
      competence(id: $subject) {
        id
        name
        competences {
          type
          id
          name
          grades
          parents {
            id
            name
          }
          competences {
            id
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
  variables: reactive({ subject, user: id }),
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
}
</script>

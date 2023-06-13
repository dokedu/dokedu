<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="font-medium text-stone-950">
        <router-link :to="{ name: 'record-projects' }">Projects</router-link>
      </div>
      <div class="flex gap-2">
        <d-button type="transparent" :icon-left="Trash2" @click="deleteEvent"> Delete </d-button>
        <d-button type="primary" :icon-left="Edit"> Edit </d-button>
      </div>
    </PageHeader>
    <PageContent>
      <div class="px-8 py-4 text-sm">
        <div class="mb-2 text-base font-medium text-strong">{{ data?.event.title }}</div>
        <div class="mb-4 text-default">{{ data?.event.body }}</div>
        <div class="text-xs text-muted">
          <span>Starts at {{ formatDate(new Date(data?.event.startsAt), "DD.MM.YYYY HH:mm") }}</span>
          <span> and runs until {{ formatDate(new Date(data?.event.endsAt), "DD.MM.YYYY HH:mm") }}</span>
          <span> and was created {{ formatTimeAgo(new Date(data?.event.createdAt)) }}</span>
        </div>
        <div class="mt-4">
          <div class="mb-2 flex items-center justify-between">
            <div class="text-strong">Competences</div>
            <div class="rounded-lg p-1 hover:bg-stone-100" @click="openCompetenceModal">
              <Plus :size="16" />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <d-competence
              v-for="competence in data?.event?.competences"
              :key="competence.id"
              :competence="competence"
            />
            <div v-if="!data?.event?.competences?.length" class="text-muted">No competences added yet.</div>
          </div>
        </div>
      </div>
    </PageContent>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import PageContent from "../../../components/PageContent.vue";
import { useMutation, useQuery } from "@urql/vue";
import { useRoute, useRouter } from "vue-router";
import DButton from "../../../components/d-button/d-button.vue";
import { Trash2 } from "lucide-vue-next";
import { Edit, Plus } from "lucide-vue-next";
import { graphql } from "../../../gql";
import { formatTimeAgo, formatDate } from "@vueuse/core";
import DCompetence from "../../../components/d-competence/d-competence.vue";

const route = useRoute();
const router = useRouter();

function openCompetenceModal() {
  alert("Please wait, this feature is not implemented yet. We are working diligently on it.");
}

const { data } = useQuery({
  query: graphql(`
    query event($id: ID!) {
      event(id: $id) {
        id
        title
        body
        createdAt
        startsAt
        endsAt
        competences {
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
  variables: {
    id: route.params.id,
  },
});

async function deleteEvent() {
  if (confirm("Are you sure you want to delete this project?")) {
    await archiveEvent({ id: route.params.id });
    await router.push({ name: "record-projects" });
  }
}
const { executeMutation: archiveEvent } = useMutation(
  graphql(`
    mutation archiveEvent($id: ID!) {
      archiveEvent(id: $id) {
        id
      }
    }
  `)
);
</script>

<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="font-medium text-stone-950">
        <router-link :to="{ name: 'record-projects' }">Projects</router-link>
      </div>
      <div class="flex gap-2">
        <d-button type="transparent" :icon-left="Trash2"> Delete </d-button>
        <d-button type="primary" :icon-left="Edit"> Edit </d-button>
      </div>
    </PageHeader>
    <PageContent>
      <div class="px-8 py-4">
        <pre>{{ data }}</pre>
      </div>
    </PageContent>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import PageContent from "../../../components/PageContent.vue";
import { gql, useQuery } from "@urql/vue";
import { useRoute } from "vue-router";
import DButton from "../../../components/d-button/d-button.vue";
import { Trash2 } from "lucide-vue-next";
import { Edit } from "lucide-vue-next";

const route = useRoute();

const { data } = useQuery({
  query: gql`
    query event($id: ID!) {
      event(id: $id) {
        id
        title
        body
        createdAt
        startsAt
        endsAt
      }
    }
  `,
  variables: {
    id: route.params.id,
  },
});
</script>

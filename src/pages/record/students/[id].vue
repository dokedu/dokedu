<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="flex items-center gap-1 text-gray-700">
        <router-link :to="{ name: 'record-students' }" class="rounded font-medium hover:text-gray-950">
          Students
        </router-link>
        <ChevronRight :size="18" class="stroke-gray-500" />
        <span class="font-medium text-gray-950">{{ data?.user?.firstName }} {{ data?.user?.lastName }}</span>
      </div>
    </PageHeader>
    <div class="flex flex-col p-4">
      <pre>{{ data?.user }}</pre>
    </div>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import { useQuery } from "@urql/vue";
import { useRoute } from "vue-router";
import { ChevronRight } from "lucide-vue-next";
import { graphql } from "../../../gql";
import { computed } from "vue";

const route = useRoute();

const id = computed<string>(() => route.params.id as string);

const { data } = useQuery({
  query: graphql(`
    query userById($id: ID!) {
      user(id: $id) {
        id
        firstName
        lastName
        role
      }
    }
  `),
  variables: { id: id.value },
});
</script>

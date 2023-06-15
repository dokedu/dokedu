<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="font-medium text-stone-950">Reports</div>
      <div class="flex gap-2">
        <d-button type="transparent" :icon-left="Newspaper">Prepare annual reports</d-button>
        <router-link :to="{ name: 'record-reports-new' }">
          <d-button type="primary" :icon-left="Plus">Create</d-button>
        </router-link>
      </div>
    </PageHeader>
    <PageContent>
      <div class="flex flex-col overflow-scroll">
        <router-link
          :to="{ name: 'record-reports-report', params: { id: report.id } }"
          v-for="report in data?.reports?.edges"
          class="flex justify-between border-b text-sm transition-all hover:bg-stone-50"
        >
          <div class="p-2 pl-8 text-strong">{{ report.id }}</div>
          <div class="p-2 pr-8 text-strong">{{ report.status }}</div>
        </router-link>
      </div>
    </PageContent>
  </PageWrapper>
</template>
<script setup lang="ts">
import { Newspaper } from "lucide-vue-next";
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import DButton from "@/components/d-button/d-button.vue";
import { Plus } from "lucide-vue-next";
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";

const { data } = useQuery({
  query: graphql(`
    query reports {
      reports {
        edges {
          id
          status
          format
          kind
          from
          to
        }
      }
    }
  `),
});
</script>

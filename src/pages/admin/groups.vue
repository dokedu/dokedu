<template>
  <PageWrapper>
    <PageHeader class="justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-neutral-950">{{ $t("group", 2) }}</div>
        <input
          v-if="false"
          v-model="search"
          type="text"
          name="search"
          id="search"
          :placeholder="$t('search')"
          class="h-8 rounded-md border border-neutral-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-neutral-200 focus:shadow-sm focus:ring-0"
        />
      </div>
      <RouterLink :to="{ name: '/admin/groups/new' }">
        <DButton type="primary" size="md" :icon-left="Plus">{{ $t("add_group") }}</DButton>
      </RouterLink>
    </PageHeader>
    <DTable
      v-model:variables="pageVariables"
      :search="search"
      :columns="columns"
      objectName="emailAccounts"
      :query="emailAccountsQuery"
      @row-click="goToEmailAccount"
    >
    </DTable>
  </PageWrapper>
  <router-view />
</template>

<script setup lang="ts">
import DButton from "@/components/d-button/d-button.vue";
import PageHeader from "@/components/page-header.vue";
import PageWrapper from "@/components/page-wrapper.vue";
import { Plus } from "lucide-vue-next";
import { ref } from "vue";
import { graphql } from "@/gql";
import DTable from "@/components/d-table/d-table.vue";
import { useRouter } from "vue-router/auto";
import { watchDebounced } from "@vueuse/core";
import type { PageVariables } from "@/types/types.ts";

const router = useRouter();
const search = ref("");

const columns = [
  {
    label: "name",
    key: "name",
  },
  {
    label: "description",
    key: "description",
  },
];

const pageVariables = ref<PageVariables[]>([
  {
    search: "",
    // order: EmailAccountOrderBy.LastNameAsc,
    limit: 50,
    offset: 0,
    nextPage: undefined,
  },
]);

watchDebounced(
  search,
  () => {
    // Get last page and set it as only with the search
    const lastPage = pageVariables.value[pageVariables.value.length - 1];
    pageVariables.value = [
      {
        search: search.value,
        order: lastPage.order,
        limit: 50,
        offset: 0,
        nextPage: undefined,
      },
    ];
  },
  { debounce: 250, maxWait: 500 },
);

const emailAccountsQuery = graphql(`
  query groups {
    emailAccounts(filter: { type: GROUP }) {
      edges {
        id
        name
        description
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

const goToEmailAccount = <Type extends { id: string }>(row: Type) => {
  router.push({ name: "/admin/groups/[id]", params: { id: row.id } });
};
</script>

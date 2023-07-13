<template>
  <PageWrapper>
    <PageHeader class="justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">{{ $t("user", 2) }}</div>
        <input
          v-model="search"
          type="text"
          name="search"
          id="search"
          :placeholder="$t('search')"
          class="h-8 rounded-md border border-stone-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-stone-200 focus:shadow-sm focus:ring-0"
        />
      </div>
      <RouterLink :to="{ name: 'admin-users-new' }">
        <DButton type="primary" size="md" :icon-left="Plus">{{ $t("add_user") }}</DButton>
      </RouterLink>
    </PageHeader>
    <DTable
      v-model:variables="pageVariables"
      :search="search"
      :columns="columns"
      objectName="users"
      :query="usersQuery"
      @row-click="goToUser"
      defaultSort="lastName"
    >
      <template #birthday-data="{ item }">
        {{ item.user?.birthday ? formatDate(new Date(Date.parse(item?.user.birthday as string)), "DD.MM.YYYY") : "-" }}
      </template>
      <template #grade-data="{ item }">
        {{ item.user?.grade || "-" }}
      </template>
    </DTable>
  </PageWrapper>
  <router-view />
</template>
<script setup lang="ts">
import DButton from "@/components/d-button/d-button.vue";
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import { Plus } from "lucide-vue-next";
import { ref } from "vue";
import { UserOrderBy } from "@/gql/graphql";
import { graphql } from "@/gql";
import DTable from "@/components/d-table/d-table.vue";
import { useRouter } from "vue-router";
import { formatDate, watchDebounced } from "@vueuse/core";
import type { PageVariables } from "@/types/types";

const router = useRouter();
const search = ref("");

const columns = [
  {
    label: "first_name",
    key: "firstName",
    sortable: {
      asc: UserOrderBy.FirstNameAsc,
      desc: UserOrderBy.FirstNameDesc,
    },
  },
  {
    label: "last_name",
    key: "lastName",
    sortable: {
      asc: UserOrderBy.LastNameAsc,
      desc: UserOrderBy.LastNameDesc,
    },
  },
  {
    label: "email",
    key: "email",
  },
];

const pageVariables = ref<PageVariables[]>([
  {
    search: "",
    order: UserOrderBy.LastNameAsc,
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
  { debounce: 250, maxWait: 500 }
);

const usersQuery = graphql(`
  query adminUsers($search: String, $order: UserOrderBy, $offset: Int) {
    users(filter: { role: [owner, admin, teacher], orderBy: $order }, search: $search, offset: $offset) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        id
        firstName
        lastName
        email
      }
    }
  }
`);

const goToUser = <Type extends { id: string }>(row: Type) => {
  router.push({ name: "admin-users-user", params: { id: row.id } });
};
</script>
```

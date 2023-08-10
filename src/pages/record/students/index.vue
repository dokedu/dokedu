<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">{{ $t("student", 2) }}</div>
        <input
          v-model="search"
          type="text"
          name="search"
          id="search"
          :placeholder="$t('search')"
          class="h-8 rounded-md border border-stone-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-stone-200 focus:shadow-sm focus:ring-0"
        />
      </div>
    </PageHeader>
    <DTable
      v-model:variables="pageVariables"
      :search="search"
      :columns="columns"
      objectName="users"
      :query="studentsQuery"
      @row-click="goToStudent"
      defaultSort="lastName"
    >
      <template #birthday-data="{ item }">
        {{
          item.student?.birthday
            ? formatDate(new Date(Date.parse(item?.student.birthday as string)), "DD.MM.YYYY")
            : "-"
        }}
      </template>
      <template #grade-data="{ item }">
        {{ item.student?.grade || "-" }}
      </template>
    </DTable>
  </PageWrapper>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import { formatDate, watchDebounced } from "@vueuse/core";
import { graphql } from "@/gql";
import { useRouter } from "vue-router/auto";
import { UserOrderBy } from "@/gql/graphql";
import DTable from "@/components/d-table/d-table.vue";
import type { PageVariables } from "@/types/types";

const search = ref("");
const router = useRouter();

const goToStudent = (row: any) => {
  router.push({ name: "/record/students/[id]", params: { id: row.id } });
};

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
    label: "birthday",
    key: "birthday",
  },
  {
    label: "grade",
    key: "grade",
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

const studentsQuery = graphql(`
  query recordStudents($search: String, $order: UserOrderBy, $offset: Int) {
    users(filter: { role: [student], orderBy: $order }, search: $search, offset: $offset) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        id
        firstName
        lastName
        student {
          id
          birthday
          grade
        }
      }
    }
  }
`);
</script>

<template>
  <PageWrapper>
    <PageHeader class="justify-between">
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
      <RouterLink :to="{ name: 'admin-students-new' }">
        <DButton type="primary" size="md" :icon-left="Plus">{{ $t("add_student") }}</DButton>
      </RouterLink>
    </PageHeader>
    <div class="flex w-full items-start gap-3 border-b border-stone-100 px-8 py-3 text-sm">
      <div class="flex w-[200px] items-center gap-1 text-muted">
        <div @click="sortBy('firstName')">{{ $t("first_name") }}</div>
        <ArrowDown
          v-if="currentSort == UserOrderBy.FirstNameAsc || currentSort == UserOrderBy.FirstNameDesc"
          class="h-4 w-4 transition-all ease-in-out"
          :class="currentSort == UserOrderBy.FirstNameAsc ? 'rotate-180' : 'rotate-0'"
        />
      </div>
      <div class="flex flex-1 items-center gap-1 text-muted">
        <div @click="sortBy('lastName')">{{ $t("last_name") }}</div>
        <ArrowDown
          v-if="currentSort == UserOrderBy.LastNameAsc || currentSort == UserOrderBy.LastNameDesc"
          class="h-4 w-4 transition-all ease-in-out"
          :class="currentSort == UserOrderBy.LastNameAsc ? 'rotate-180' : 'rotate-0'"
        />
      </div>
      <div class="flex w-[200px] items-center gap-1 text-muted">{{ $t("grade") }}</div>
      <div class="flex w-[100px] items-center gap-1 text-muted">{{ $t("birthday") }}</div>
    </div>
    <div class="flex flex-col overflow-scroll" ref="adminStudentContainer">
      <PageSearchResult
        v-for="(variables, i) in pageVariables"
        :key="i"
        :variables="variables"
        :query="studentsQuery"
        objectName="users"
      >
        <template v-slot="{ row }">
          <router-link
            :to="{ name: 'admin-students-student', params: { id: row.id } }"
            class="flex gap-3 border-b border-stone-100 px-8 py-2 transition-all hover:bg-stone-50"
          >
            <div class="line-clamp-1 w-[200px] text-sm text-strong">{{ row.firstName }}</div>
            <div class="line-clamp-1 flex-1 text-sm text-strong">{{ row.lastName }}</div>
            <div class="line-clamp-1 w-[200px] text-sm font-medium text-strong">
              {{ row.student?.grade }}
            </div>
            <div v-if="row.student?.birthday" class="line-clamp-1 w-[100px] text-sm font-medium text-strong">
              {{ formatDate(new Date(Date.parse(row?.student.birthday as string)), "DD.MM.YYYY") }}
            </div>
            <div v-else class="w-[100px] text-sm font-medium text-strong">-</div>
          </router-link>
        </template>
      </PageSearchResult>
    </div>
  </PageWrapper>
  <router-view />
</template>
<script setup lang="ts">
import DButton from "@/components/d-button/d-button.vue";
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import { Plus } from "lucide-vue-next";
import { ref, reactive, watch } from "vue";
import { formatDate } from "@vueuse/core";
import { ArrowDown } from "lucide-vue-next";
import { UserOrderBy } from "@/gql/graphql";
import { useInfiniteScroll } from "@vueuse/core";
import PageSearchResult from "@/components/PageSearchResult.vue";
import { graphql } from "@/gql";

const search = ref("");
const adminStudentContainer = ref<HTMLElement | null>(null);
const currentSort = ref<UserOrderBy>(UserOrderBy.LastNameAsc);

const pageVariables = ref([
  {
    search: "",
    order: UserOrderBy.LastNameAsc,
    offset: 0,
    nextPage: null,
  },
]);

const loadMore = () => {
  const lastPage = pageVariables.value[pageVariables.value.length - 1];
  if (!lastPage.nextPage) return;
  pageVariables.value.push({
    search: search.value,
    order: currentSort.value,
    offset: lastPage.offset + 50,
    nextPage: null,
  });
};

watch([search, currentSort], () => {
  pageVariables.value = [
    {
      search: search.value,
      order: currentSort.value,
      offset: 0,
      nextPage: null,
    },
  ];
});

useInfiniteScroll(adminStudentContainer, loadMore);
const studentsQuery = graphql(`
  query adminStudents($search: String, $order: UserOrderBy, $offset: Int) {
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

const sortColumns = reactive<{ [key: string]: { [key: string]: UserOrderBy } }>({
  firstName: {
    asc: UserOrderBy.FirstNameAsc,
    desc: UserOrderBy.FirstNameDesc,
  },
  lastName: {
    asc: UserOrderBy.LastNameAsc,
    desc: UserOrderBy.LastNameDesc,
  },
});

function sortBy(column: string) {
  if (currentSort.value === sortColumns[column].asc) {
    currentSort.value = sortColumns[column].desc;
  } else {
    currentSort.value = sortColumns[column].asc;
  }
}
</script>
```

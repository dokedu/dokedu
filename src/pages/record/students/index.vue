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
    <div class="flex flex-col overflow-scroll" ref="studentContainer">
      <PageSearchResult
        v-for="(variables, i) in pageVariables"
        :key="i"
        :variables="variables"
        :query="studentsQuery"
        objectName="users"
        @fetched="fetchedAll = true"
      >
        <template v-slot="{ row }">
          <router-link
            :to="{ name: 'record-students-student', params: { id: row.id } }"
            class="flex border-b border-stone-100 transition-all hover:bg-stone-50"
          >
            <div class="px-8 py-2 text-sm text-strong">{{ `${row.firstName} ${row.lastName}` }}</div>
          </router-link>
        </template>
      </PageSearchResult>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import { useInfiniteScroll } from "@vueuse/core";
import { graphql } from "@/gql";
import PageSearchResult from "@/components/PageSearchResult.vue";

const search = ref("");
const studentContainer = ref<HTMLElement | null>(null);
const fetchedAll = ref(false);

const pageVariables = ref([
  {
    search: "",
    offset: 0,
  },
]);

const loadMore = () => {
  if (fetchedAll.value) return;
  const lastPage = pageVariables.value[pageVariables.value.length - 1];
  pageVariables.value.push({
    search: search.value,
    offset: lastPage.offset + 50,
  });
};

watch([search], () => {
  pageVariables.value = [
    {
      search: search.value,
      offset: 0,
    },
  ];
  fetchedAll.value = false;
});

useInfiniteScroll(studentContainer, loadMore);

const studentsQuery = graphql(`
  query recordStudents($search: String, $offset: Int) {
    users(filter: { role: [student], orderBy: lastNameAsc }, search: $search, offset: $offset) {
      pageInfo {
        hasNextPage
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

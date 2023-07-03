<template>
  <DSelect
    :label="$t('student', 2)"
    :query="studentQuery"
    object-name="users"
    :page-variables="pageVariables"
    searchable
    @load-more="loadMore"
    @search="onSearch"
  >
    <template v-slot="{ row }">
      <div>{{ row.firstName }} {{ row.lastName }}</div>
    </template>
  </DSelect>
</template>

<script lang="ts" setup>
import DSelect from "@/components/d-select/d-select.vue";
import { graphql } from "@/gql";
import { ref } from "vue";

const studentQuery = graphql(`
  query getEntryFilterStudents($offset: Int, $limit: Int, $search: String) {
    users(filter: { role: [student] }, offset: $offset, limit: $limit, search: $search) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        id
        firstName
        lastName
      }
    }
  }
`);

const pageVariables = ref([
  {
    search: "",
    offset: 0,
    nextPage: null,
  },
]);

const loadMore = () => {
  const lastPage = pageVariables.value[pageVariables.value.length - 1];
  if (!lastPage.nextPage) return;
  pageVariables.value.push({
    search: "",
    offset: lastPage.offset + 50,
    nextPage: null,
  });
};

const onSearch = (input: string) => {
  pageVariables.value = [
    {
      search: input,
      offset: 0,
      nextPage: null,
    },
  ];
};
</script>

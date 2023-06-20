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
    <div class="flex flex-col overflow-scroll">
      <router-link
        :to="{ name: 'record-students-student', params: { id: student.id } }"
        v-for="student in data?.users?.edges"
        class="flex border-b border-stone-100 transition-all hover:bg-stone-50"
      >
        <div class="px-8 py-2 text-sm text-strong">{{ `${student.firstName} ${student.lastName}` }}</div>
      </router-link>
    </div>
    <div v-if="loading" class="flex flex-col overflow-scroll">
      <div
        v-for="i in 25"
        :key="i"
        class="flex h-9 min-h-[36px] animate-pulse items-center gap-4 border-b border-stone-100 px-8"
      >
        <div class="h-2.5 w-20 rounded-full bg-stone-200"></div>
        <div class="h-2.5 w-20 rounded-full bg-stone-200"></div>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import { gql, useQuery } from "@urql/vue";

const search = ref("");

const loading = computed(() => {
  return fetching && !data.value;
});

const { data, fetching } = useQuery({
  query: gql`
    query usersSearch($search: String) {
      users(filter: { role: [student], orderBy: [first_name, last_name] }, search: $search) {
        edges {
          id
          firstName
          lastName
          student {
            id
          }
        }
      }
    }
  `,
  variables: reactive({
    search: search,
  }),
});
</script>

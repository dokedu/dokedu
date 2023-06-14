<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">Students</div>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          class="h-8 rounded-md border border-stone-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-stone-200 focus:shadow-sm focus:ring-0"
        />
      </div>
    </PageHeader>
    <div class="flex flex-col">
      <router-link
        :to="{ name: 'record-students-student', params: { id: student.id } }"
        v-for="student in data?.users?.edges"
        class="flex border-b border-stone-100 transition-all hover:bg-stone-50"
      >
        <div class="px-8 py-2 text-sm text-strong">{{ `${student.firstName} ${student.lastName}` }}</div>
      </router-link>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import { gql, useQuery } from "@urql/vue";

const { data } = useQuery({
  query: gql`
    query {
      users(filter: { role: [student] }) {
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
});
</script>

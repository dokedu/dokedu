<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">Students</div>
        <input type="search" name="search" id="search" placeholder="Search students"
          class="rounded-md border h-8 border-stone-100 text-sm outline-none transition-all focus:shadow-sm focus:border-stone-200 focus:ring-0 ring-0" />
      </div>
    </PageHeader>
    <div class="flex flex-col">
      <router-link :to="{ name: 'record-students-student', params: { id: student.id } }"
        v-for="student in data?.users?.edges" class="flex border-b border-stone-100 transition-all hover:bg-stone-50">
        <div class="px-8 py-2">{{ `${student.firstName} ${student.lastName}` }}</div>
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
          role
        }
      }
    }
  `,
});
</script>

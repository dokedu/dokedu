<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
        <div class="flex items-center gap-4">
          <div class="text-gray-950 font-medium">Schüler</div>
          <input type="search" name="search" id="search" placeholder="Schüler suchen" class="border border-gray-200 rounded-md focus:border-gray-300 focus:ring-0 text-sm">
        </div>
    </PageHeader>
    <div class="flex flex-col">
      <router-link :to="{ name: 'record-student', params: {id: student.id}}" v-for="student in data?.users?.edges" class="flex hover:bg-gray-50 transition-all border-b">
        <div class="px-8 py-4">{{ `${student.firstName} ${student.lastName}` }}</div>
      </router-link>
    </div>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import {gql, useQuery} from "@urql/vue";

const {data} = useQuery({
  query: gql`
query {
  users {
    edges {
      id
      firstName
      lastName
      role
    }
  }
}`
})
</script>
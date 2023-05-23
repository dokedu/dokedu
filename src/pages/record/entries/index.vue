<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="text-gray-950 font-medium">Einträge</div>
      <router-link :to="{ name: 'record-entries-new' }" class="bg-black text-white px-6 py-1.5 rounded-md">
        Eintrag erstellen
      </router-link>
    </PageHeader>
    <div class="flex flex-col">
      <router-link :to="{ name: 'record-entry', params: {id: entry.id}}" v-for="entry in data?.entries?.edges" class="flex hover:bg-gray-50 transition-all border-b">
        <div class="p-2 pl-8 w-full">{{ entry.body }}</div>
        <div class="p-2 w-1/4">{{ dateOnly(entry.date) }}</div>
        <div class="p-2 w-1/4">{{ `${entry.user.firstName} ${entry.user.lastName}` }}</div>
        <div class="p-2 pr-8 w-1/3">{{ dateTime(entry.createdAt) }}</div>
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
  entries {
    edges {
      id
      date
      body
      user {
        id
        firstName
        lastName
      }
      createdAt
    }
  }
}`
})


function dateTime(date: string) {
const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
  return new Date(date).toLocaleDateString('de-DE', options)
}

function dateOnly(date: string) {
const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' }
  return new Date(date).toLocaleDateString('de-DE', options)
}

</script>
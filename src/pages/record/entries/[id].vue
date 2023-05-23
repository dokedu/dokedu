<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="text-gray-950 font-medium">Einträge</div>
      <router-link :to="{ name: 'record-entry', params: { id: $route.params.id } }" class="bg-black text-white px-6 py-1.5 rounded-md">
        Bearbeiten
      </router-link>
    </PageHeader>
    <div class="p-4 flex flex-col">
        <pre>{{data?.entry}}</pre>
      <div class="flex flex-wrap gap-4">
        <DTag v-for="tag in tags" :key="tag.id">{{tag.name}}</DTag>
      </div>
    </div>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import {gql, useQuery} from "@urql/vue";
import {useRoute} from "vue-router";
import DTag from "../../../components/d-tag/d-tag.vue";
import {computed} from "vue";

const route = useRoute()

const tags = computed(() => {
  return data?.value?.entry?.entryTags?.map(el => el.tag)
})

const {data} = useQuery({
  query: gql`
query entry($id: ID!) {
  entry(id: $id) {
    id
    date
    body
    user {
      id
      firstName
      lastName
    }
    createdAt
    entryTags {
    id
    tag {
    id
    name
    }
    }
  }
}`,
  variables: { id: route.params.id }
})

</script>
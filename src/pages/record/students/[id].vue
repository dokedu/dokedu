<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="text-gray-950 font-medium">Schüler</div>
    </PageHeader>
    <div class="p-4 flex flex-col">
      <div class="text-2xl mb-3 font-medium text-gray-800">{{ data?.user?.firstName }} {{ data?.user?.lastName }}</div>
      <pre>{{ data?.user?.role }}</pre>
    </div>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import {gql, useQuery} from "@urql/vue";
import {useRoute} from "vue-router";

const route = useRoute()

const {data} = useQuery({
  query: gql`
query entry($id: ID!) {
  user(id: $id) {
    id
    firstName
    lastName
    role
  }
}`,
  variables: {id: route.params.id}
})

</script>
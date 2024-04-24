<script setup lang="ts">
import { useQuery, gql } from '@urql/vue'

const { data, error } = useQuery({
  query: gql`
    query {
      entries(limit: 1000) {
        edges {
          id
          date
          body
          createdAt
        }
      }
    }
  `
})
</script>

<template>
  <div class="h-full">
    <div class="p-4 text-sm">
      <div>hello there</div>
      <br />
      <pre>error: {{ error }}</pre>
      <br />
      <pre>data: {{ data }}</pre>
    </div>
  </div>
</template>

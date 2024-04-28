<script setup lang="ts">
import { computed } from 'vue'
import { useQuery, gql } from '@urql/vue'
import DButton from '@/components/d-button/d-button.vue'

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

const entries = computed(() => {
  return data?.value?.entries?.edges
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="h-full">
    <div class="p-2 text-sm">
      <div class="mb-2 flex items-center justify-between">
        <div class="text-md px-2 font-semibold text-neutral-900">Entries</div>
        <d-button variant="primary" size="sm">New entry</d-button>
      </div>
      <div class="divide-neutral-200">
        <router-link
          :to="`/entries/${entry.id}`"
          v-for="entry in entries"
          :key="entry.id"
          class="flex cursor-default justify-between rounded-md p-2 text-neutral-950 hover:bg-neutral-100"
        >
          <div class="flex text-neutral-950">
            <div>{{ formatDate(entry.createdAt) }}</div>
            <span class="px-1">-</span>
            <span class="text-neutral-500">{{ entry.body }}</span>
          </div>
          <code class="text-neutral-700">{{ entry.id }}</code>
        </router-link>
      </div>
    </div>
  </div>
</template>

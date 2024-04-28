<script setup lang="ts">
import { computed } from 'vue'
import { useQuery, gql, useMutation } from '@urql/vue'
import { useRoute, useRouter } from 'vue-router/auto'
import DButton from '@/components/d-button/d-button.vue'

const route = useRoute('/entries/[id]')
const router = useRouter()

const { data, error } = useQuery({
  query: gql`
    query entry($id: ID!) {
      entry(id: $id) {
        id
        date
        body
        createdAt
      }
    }
  `,
  variables: {
    id: route.params.id
  }
})

const { executeMutation: updateEntry } = useMutation(gql`
  mutation updateEntry($input: UpdateEntryInput!) {
    updateEntry(input: $input) {
      id
      date
      body
      createdAt
      deletedAt
    }
  }
`)

async function save() {
  await updateEntry({
    input: {
      id: route.params.id,
      body: entry.value.body
    }
  })
  await router.push('/')
}

const entry = computed(() => {
  return data?.value?.entry
})
</script>

<template>
  <div class="h-full">
    <div v-if="entry">
      <form class="flex flex-col gap-4 p-4" @submit.prevent="save">
        <div class="flex">
          <router-link class="text-sm hover:underline" to="/">Go back</router-link>
        </div>
        <code class="mb-2 text-sm">{{ entry.id }}</code>
        <textarea
          class="min-h-[7rem] rounded-md border border-neutral-200 text-sm shadow-sm"
          v-model="entry.body"
        />
        <button
          class="transition-color group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-lg border border-transparent bg-neutral-950 px-2 py-1 text-sm text-sm text-white shadow-sm hover:bg-neutral-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-neutral-700"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  </div>
</template>

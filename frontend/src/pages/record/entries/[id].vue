<template>
  <PageWrapper>
    <EntryForm v-if="entry" :entry="entry.entry" @archived="archived" />
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from "@/components/page-wrapper.vue"
import EntryForm from "@/components/d-entry/d-entry-form.vue"
import { useRoute, useRouter } from "vue-router/auto"
import { useEntryById2Query } from "@/gql/queries/entries/entryById2"

const route = useRoute<"/record/entries/[id]">()
const router = useRouter()

async function archived() {
  await router.push({ name: "/record/entries/" })
}

const { data: entry } = useEntryById2Query({
  variables: { id: route.params.id }
})
</script>

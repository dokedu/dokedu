<template>
  <div v-if="data?.event" class="h-full w-full">
    <d-project-form :project="data.event" :cancel="data.event" @cancel="cancel" @save="save" />
  </div>
</template>

<script lang="ts" setup>
import { onKeyStroke } from "@vueuse/core"
import { reactive } from "vue"
import { useRoute, useRouter } from "vue-router/auto"
import DProjectForm from "@/components/d-project-form.vue"
import { useEventQuery } from "@/gql/queries/events/event"
import type { Event } from "@/gql/schema"

const route = useRoute<"/record/projects/[id]">()
const router = useRouter()

async function cancel() {
  await router.push({ name: "/record/projects/" })
}

async function save() {
  if (route.name === "/record/projects/[id]") return
  await router.push({ name: "/record/projects/" })
}

onKeyStroke("Escape", async () => {
  if (route.name === "/record/projects/[id]") return
  await cancel()
})

const { data } = useEventQuery({
  variables: reactive({
    id: route.params.id as string
  })
})
</script>
